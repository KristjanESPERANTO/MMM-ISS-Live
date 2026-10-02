const assert = require("node:assert/strict");
const {readFileSync} = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = readFileSync(path.join(__dirname, "../playback-monitor.js"), "utf8");

const createMonitor = () => {
  const listeners = {};
  const intervals = [];
  const clearedIntervals = [];
  const timeouts = [];
  const window = {
    addEventListener: (name, handler) => {
      listeners[name] = handler;
    },
    clearInterval: (id) => clearedIntervals.push(id),
    clearTimeout: () => null,
    setInterval: (handler) => {
      intervals.push(handler);
      return intervals.length;
    },
    setTimeout: (handler) => {
      timeouts.push(handler);
      return 2;
    }
  };

  vm.runInNewContext(source, {AbortController,
    window});

  return {monitor: window.ISSLivePlaybackMonitor,
    intervals,
    clearedIntervals,
    listeners,
    timeouts};
};

test("parses YouTube player messages and ignores invalid JSON", () => {
  const {monitor} = createMonitor();

  const parsed = monitor.parseMessage("{\"event\":\"onError\",\"info\":101}");

  assert.equal(parsed.event, "onError");
  assert.equal(parsed.info, 101);
  assert.equal(Object.keys(monitor.parseMessage("not json")).length, 0);
});

test("reports iframe error codes from the embedded player", () => {
  const {monitor, listeners} = createMonitor();
  const reports = [];
  const iframe = {contentWindow: {},
    isConnected: true};

  monitor.watchIframe(iframe, (message) => reports.push(message));
  listeners.message({source: iframe.contentWindow,
    data: "{\"event\":\"onError\",\"info\":101}"});

  assert.match(reports[0], /disabled embedding/u);
});

test("ignores unrelated iframe messages and reports unknown error codes", () => {
  const {monitor, listeners} = createMonitor();
  const reports = [];
  const iframe = {contentWindow: {},
    isConnected: true};

  monitor.watchIframe(iframe, (message) => reports.push(message));
  listeners.message({source: {},
    data: "{\"event\":\"onError\",\"info\":101}"});
  assert.equal(reports.length, 0);

  listeners.message({source: iframe.contentWindow,
    data: "{\"event\":\"onError\",\"info\":999}"});
  assert.match(reports[0], /error 999/u);
});

test("reports iframe playback and timeout states", () => {
  const {monitor, listeners, timeouts} = createMonitor();
  const reports = [];
  const iframe = {contentWindow: {},
    isConnected: true};

  monitor.watchIframe(iframe, (message) => reports.push(message));
  listeners.message({source: iframe.contentWindow,
    data: "{\"event\":\"onStateChange\",\"info\":1}"});
  assert.deepEqual(reports, [""]);

  monitor.watchIframe(iframe, (message) => reports.push(message));
  timeouts.at(-1)();
  assert.match(reports.at(-1), /ad blocker or DNS filter/u);
});

test("recognizes playback from infoDelivery messages", () => {
  const {monitor, listeners} = createMonitor();
  const reports = [];
  const iframe = {contentWindow: {},
    isConnected: true};

  monitor.watchIframe(iframe, (message) => reports.push(message));
  listeners.message({source: iframe.contentWindow,
    data: "{\"event\":\"infoDelivery\",\"info\":{\"playerState\":1}}"});

  assert.deepEqual(reports, [""]);
});

test("does not report an iframe timeout after its removal", () => {
  const {monitor, timeouts} = createMonitor();
  const reports = [];
  const iframe = {contentWindow: {},
    isConnected: false};

  monitor.watchIframe(iframe, (message) => reports.push(message));
  timeouts.at(-1)();

  assert.equal(reports.length, 0);
});

test("formats webview error details and clears status after playback", () => {
  const {monitor} = createMonitor();
  const reports = [];
  const report = (message) => reports.push(message);

  monitor.reportWebviewState({error: "Video unavailable",
    details: "Playback restricted"}, false, report);
  monitor.reportWebviewState({playing: true}, false, report);

  assert.match(reports[0], /Video unavailable - Playback restricted/u);
  assert.match(reports[0], /AdGuard Home/u);
  assert.equal(reports[1], "");
});

test("polls the webview and stops polling after a player error", async () => {
  const {monitor, intervals, clearedIntervals} = createMonitor();
  const reports = [];
  const listeners = {};
  const webview = {
    addEventListener: (name, handler) => {
      listeners[name] = handler;
    },
    executeJavaScript: (script) => {
      assert.match(script, /ytp-error-content-wrap-reason/u);
      return Promise.resolve({error: "Video unavailable",
        details: "Playback restricted"});
    },
    isConnected: true
  };

  monitor.watchWebview(webview, (message) => reports.push(message));
  listeners["dom-ready"]();
  await intervals.at(-1)();

  assert.match(reports[0], /Video unavailable - Playback restricted/u);
  assert.deepEqual(clearedIntervals, [1]);
});

test("reports a webview timeout", () => {
  const {monitor} = createMonitor();
  let message = "";

  monitor.reportWebviewState(null, true, (text) => {
    message = text;
  });

  assert.match(message, /video does not start/u);
});
