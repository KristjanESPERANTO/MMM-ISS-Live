/* global Log Module */

Module.register("MMM-ISS-Live", {
  defaults: {
    height: "270px",
    width: "480px",
    animationSpeed: 0,
    updateInterval: 60 * 60 * 1_000,
    mute: true,
    webPreferences: "autoplayPolicy=no-user-gesture-required"
  },
  start () {
    setInterval(() => {
      this.updateDom(this.config.animationSpeed || 0);
    }, this.config.updateInterval);
  },

  getDom () {
    const isElectron = this.isElectron();
    const shouldMute = this.getEffectiveMute(isElectron);
    const streamUrl = this.buildStreamUrl(shouldMute);

    if (!this.shouldUseWebview(isElectron)) {
      if (isElectron) {
        Log.warn(`${this.name} falling back to iframe because webview is disabled or unsupported.`);
      }
      return this.createIframe(streamUrl);
    }

    const webview = document.createElement("webview");
    this.applyWebviewAppearance(webview);
    webview.src = streamUrl;

    this.applyWebviewPreferences(webview);
    this.attachAudioMuteHandler(webview, shouldMute);
    this.attachWebviewFallbackHandlers(webview, streamUrl);

    return webview;
  },

  applyWebviewAppearance (webview) {
    webview.classList.add("webview", "iframe");
    webview.style.border = "0 none transparent";
    webview.style.width = this.config.width;
    webview.style.height = this.config.height;
    webview.width = this.config.width;
    webview.height = this.config.height;
  },

  applyWebviewPreferences (webview) {
    webview.setAttribute("allow", "autoplay; fullscreen; picture-in-picture; encrypted-media");
    webview.setAttribute("allowsInlineMediaPlayback", "true");
    webview.setAttribute("allowfullscreen", "true");

    if (this.config.webPreferences) {
      webview.setAttribute("webpreferences", this.config.webPreferences);
    }
  },

  buildStreamUrl (shouldMute) {
    const defaultUrl = "https://www.youtube.com/embed/yf5cEJULZXk?si=Dx852YRN5q6NHj0K";
    let streamUrl = this.config.url || defaultUrl;

    try {
      const parsedUrl = new URL(streamUrl);
      parsedUrl.searchParams.set("autoplay", "1");
      parsedUrl.searchParams.set("playsinline", "1");

      parsedUrl.searchParams.set("mute", shouldMute
        ? "1"
        : "0");

      streamUrl = parsedUrl.toString();
    } catch (error) {
      Log.warn(`${this.name} failed to parse stream url: ${streamUrl}`, error);

      if (!streamUrl.includes("autoplay=")) {
        streamUrl += streamUrl.includes("?")
          ? "&autoplay=1"
          : "?autoplay=1";
      }

      if (shouldMute && !streamUrl.includes("mute=")) {
        streamUrl += streamUrl.includes("?")
          ? "&mute=1"
          : "?mute=1";
      }
    }

    return streamUrl;
  },

  attachAudioMuteHandler (webview, shouldMute) {
    webview.addEventListener("dom-ready", () => {
      try {
        webview.setAudioMuted(Boolean(shouldMute));
      } catch (error) {
        Log.error(`${this.name} failed to set audio muted`, error);
      }
    });
  },

  attachWebviewFallbackHandlers (webview, streamUrl) {
    const replaceWithIframe = (reason) => {
      if (webview.dataset.fallbackApplied === "true") {
        return;
      }

      webview.dataset.fallbackApplied = "true";
      const iframe = this.createIframe(streamUrl);
      Log.warn(`${this.name} switching to iframe fallback (${reason}).`);
      webview.replaceWith(iframe);
    };

    const fallbackTimeout = window.setTimeout(() => {
      replaceWithIframe("webview timeout");
    }, 5_000);

    const cancelFallback = () => {
      window.clearTimeout(fallbackTimeout);
    };

    webview.addEventListener("did-attach", cancelFallback);
    webview.addEventListener("dom-ready", cancelFallback);

    webview.addEventListener("did-fail-load", (event) => {
      cancelFallback();
      if (event && event.errorCode !== -3) {
        replaceWithIframe(`did-fail-load ${event.errorCode} ${event.errorDescription}`);
      }
    });
  },

  shouldUseWebview (isElectron) {
    if (!isElectron) {
      return false;
    }

    const element = document.createElement("webview");
    const isWebviewTag = element && element.tagName === "WEBVIEW";
    const hasWebviewAPIs = typeof element.reload === "function";

    if (isWebviewTag && hasWebviewAPIs) {
      return true;
    }

    if (isWebviewTag && !hasWebviewAPIs && !this.loggedWebviewDisableWarning) {
      Log.warn(`${this.name} detected Electron but the webview tag is disabled. ` +
        "Set electronOptions.webPreferences.webviewTag = true in your MagicMirror config.");
      this.loggedWebviewDisableWarning = true;
    }

    return false;
  },

  createIframe (streamUrl) {
    const iframe = document.createElement("iframe");
    iframe.classList.add("iframe");
    iframe.style.border = "0 none transparent";
    iframe.style.width = this.config.width;
    iframe.style.height = this.config.height;
    iframe.width = this.config.width;
    iframe.height = this.config.height;
    iframe.setAttribute("allow", "autoplay; fullscreen; picture-in-picture; encrypted-media");
    iframe.src = streamUrl;

    return iframe;
  },

  getEffectiveMute (isElectron) {
    if (isElectron) {
      return Boolean(this.config.mute);
    }

    if (!this.config.mute && !this.loggedBrowserAutoplayWarning) {
      Log.warn(`${this.name} forces mute outside Electron to satisfy browser autoplay policies.`);
      this.loggedBrowserAutoplayWarning = true;
    }

    return true;
  },

  isElectron () {
    const userAgent = navigator?.userAgent || "";
    return userAgent.includes("Electron");
  },

  /*  Add this function to the modules you want to control with voice */
  notificationReceived (notification, payload) {
    if (notification === "HIDE_STATION") {
      Log.log(`${this.name} received hide command: ${payload}`);
      this.hide(1_000);
    } else if (notification === "SHOW_STATION") {
      Log.log(`${this.name} received show command: ${payload}`);
      this.show(1_000);
    }
  }
});
