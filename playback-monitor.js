/**
 * Detects whether the embedded YouTube player actually plays and reports problems in plain text.
 * The player itself only shows vague errors, so ask it directly (iframe) or read its DOM (webview).
 */
window.ISSLivePlaybackMonitor = {
  startTimeout: 30_000,
  pollInterval: 3_000,
  hint: "If the video plays elsewhere, an ad blocker or DNS filter (e.g. Pi-hole, AdGuard Home) may be blocking YouTube.",
  notPlaying: "The video does not start. An ad blocker or DNS filter (e.g. Pi-hole, AdGuard Home) may be blocking YouTube.",
  iframeErrors: {
    2: "The video URL is invalid.",
    5: "The YouTube player had an internal error.",
    100: "The video does not exist or is private.",
    101: "The owner of the video has disabled embedding on other websites.",
    150: "The owner of the video has disabled embedding on other websites.",
    153: "YouTube did not get a valid referrer. An ad blocker or DNS filter may interfere."
  },

  /**
   * Listen to the YouTube iframe API messages of an embedded player.
   * @param {HTMLIFrameElement} iframe - The player iframe.
   * @param {(text: string) => void} report - Called with a problem text, or with "" once the video plays.
   */
  watchIframe (iframe, report) {
    const controller = new AbortController();
    const timers = [];
    const stop = () => {
      controller.abort();
      timers.forEach((timer) => window.clearTimeout(timer));
    };
    let heard = false;

    window.addEventListener("message", (event) => {
      if (event.source !== iframe.contentWindow) {
        return;
      }

      heard = true;
      const {event: name, info} = this.parseMessage(event.data);
      const playing = name === "onStateChange" && info === 1 || name === "infoDelivery" && info?.playerState === 1;

      if (name === "onError") {
        stop();
        report(this.iframeErrors[info] || `The YouTube player reported error ${info}.`);
      } else if (playing) {
        stop();
        report("");
      }
    }, {signal: controller.signal});

    // The player only sends events after it was told that someone is listening.
    timers.push(window.setInterval(() => {
      if (!heard) {
        iframe.contentWindow?.postMessage(JSON.stringify({event: "listening",
          id: 1,
          channel: "widget"}), "*");
      }
    }, 1_000));

    timers.push(window.setTimeout(() => {
      stop();
      if (iframe.isConnected) {
        report(this.notPlaying);
      }
    }, this.startTimeout));
  },

  /**
   * Poll the DOM of a webview for a YouTube error text or a running video.
   * @param {Electron.WebviewTag} webview - The player webview.
   * @param {(text: string) => void} report - Called with a problem text, or with "" once the video plays.
   */
  watchWebview (webview, report) {
    const script = `(() => {
      const reason = document.querySelector(".ytp-error-content-wrap-reason");
      const subreason = document.querySelector(".ytp-error-content-wrap-subreason");
      const video = document.querySelector("video");
      return {
        error: reason ? reason.textContent : "",
        details: subreason ? subreason.textContent : "",
        playing: Boolean(video && !video.paused && video.readyState > 2)
      };
    })()`;

    webview.addEventListener("dom-ready", () => {
      const startedAt = Date.now();
      const timer = window.setInterval(async () => {
        let state = null;

        try {
          state = await webview.executeJavaScript(script);
        } catch {
          // Webview not ready or already gone; retry on the next tick.
        }

        const timedOut = Date.now() - startedAt > this.startTimeout;

        if (!webview.isConnected || state?.playing || state?.error || timedOut) {
          window.clearInterval(timer);
        }

        if (webview.isConnected) {
          this.reportWebviewState(state, timedOut, report);
        }
      }, this.pollInterval);
    }, {once: true});
  },

  reportWebviewState (state, timedOut, report) {
    if (state?.playing) {
      report("");
    } else if (state?.error) {
      report(`YouTube says: "${[state.error, state.details].filter(Boolean).join(" - ")}". ${this.hint}`);
    } else if (timedOut) {
      report(this.notPlaying);
    }
  },

  parseMessage (data) {
    try {
      return JSON.parse(data) || {};
    } catch {
      return {};
    }
  }
};
