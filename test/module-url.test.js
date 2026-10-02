const assert = require("node:assert/strict");
const {readFileSync} = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = readFileSync(path.join(__dirname, "../MMM-ISS-Live.js"), "utf8");

const createModule = (config = {}, origin = "http://localhost:8080") => {
  const registeredModule = {};
  const context = {
    Log: {error: () => null,
      log: () => null,
      warn: () => null},
    Module: {register: (...args) => Object.assign(registeredModule, args[1])},
    URL
  };

  vm.runInNewContext(source, context);

  return Object.assign(registeredModule, {
    config,
    getOrigin: () => origin
  });
};

test("converts YouTube watch and short URLs to embed URLs", () => {
  const module = createModule();

  assert.equal(
    module.convertYouTubeUrl("https://www.youtube.com/watch?v=videoId12345&t=30"),
    "https://www.youtube.com/embed/videoId12345"
  );
  assert.equal(
    module.convertYouTubeUrl("https://youtu.be/videoId12345?si=shareId"),
    "https://www.youtube.com/embed/videoId12345"
  );
});

test("leaves embed URLs and unconvertible YouTube URLs unchanged", () => {
  const module = createModule();
  const embedUrl = "https://www.youtube.com/embed/videoId12345";
  const missingVideoId = "https://www.youtube.com/watch?feature=share";

  assert.equal(module.convertYouTubeUrl(embedUrl), embedUrl);
  assert.equal(module.convertYouTubeUrl(missingVideoId), missingVideoId);
});

test("uses the default stream and adds required player parameters", () => {
  const module = createModule();
  const streamUrl = new URL(module.buildStreamUrl(true));

  assert.equal(streamUrl.pathname, "/embed/fO9e9jnhYK8");
  assert.equal(streamUrl.searchParams.get("autoplay"), "1");
  assert.equal(streamUrl.searchParams.get("playsinline"), "1");
  assert.equal(streamUrl.searchParams.get("rel"), "0");
  assert.equal(streamUrl.searchParams.get("enablejsapi"), "1");
  assert.equal(streamUrl.searchParams.get("mute"), "1");
  assert.equal(streamUrl.searchParams.get("origin"), "http://localhost:8080");
  assert.equal(streamUrl.searchParams.get("widget_referrer"), "http://localhost:8080");
});

test("preserves custom URL parameters and applies unmuted playback", () => {
  const module = createModule({url: "https://www.youtube.com/embed/videoId12345?start=42"}, null);
  const streamUrl = new URL(module.buildStreamUrl(false));

  assert.equal(streamUrl.searchParams.get("start"), "42");
  assert.equal(streamUrl.searchParams.get("mute"), "0");
  assert.equal(streamUrl.searchParams.has("origin"), false);
  assert.equal(streamUrl.searchParams.has("widget_referrer"), false);
});
