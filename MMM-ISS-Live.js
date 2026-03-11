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

    if (this.shouldUseWebview(isElectron)) {
      return this.createWebview(streamUrl, shouldMute);
    }

    if (isElectron) {
      Log.warn(`${this.name} falling back to iframe because webview is disabled or unsupported.`);
    }

    return this.createIframe(streamUrl);
  },

  // --- URL handling ---

  /**
   * Convert youtube.com/watch or youtu.be short URLs to the embed format.
   * @param {string} url - The URL to convert.
   * @returns {string} The embed URL or the original URL if conversion failed.
   */
  convertYouTubeUrl (url) {
    if (!url.includes("youtube.com/watch") && !url.includes("youtu.be/")) {
      return url;
    }

    try {
      let videoId = "";

      if (url.includes("youtu.be/")) {
        const [, path] = url.split("youtu.be/");
        [videoId] = path.split("?");
      } else {
        videoId = new URL(url).searchParams.get("v");
      }

      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        Log.log(`${this.name} converted URL to embed format: ${embedUrl}`);
        return embedUrl;
      }
    } catch (error) {
      Log.error(`${this.name} failed to parse YouTube URL: ${url}`, error);
    }

    return url;
  },

  buildStreamUrl (shouldMute) {
    const defaultUrl = "https://www.youtube.com/embed/fO9e9jnhYK8";
    const baseUrl = this.convertYouTubeUrl(this.config.url || defaultUrl);

    try {
      const url = new URL(baseUrl);
      url.searchParams.set("autoplay", "1");
      url.searchParams.set("playsinline", "1");
      url.searchParams.set("rel", "0");
      url.searchParams.set("mute", shouldMute
        ? "1"
        : "0");

      const origin = this.getOrigin();

      if (origin) {
        url.searchParams.set("origin", origin);
        url.searchParams.set("widget_referrer", origin);
      }

      return url.toString();
    } catch (error) {
      Log.warn(`${this.name} failed to parse stream URL: ${baseUrl}`, error);
      return baseUrl;
    }
  },

  // --- DOM creation ---

  createWebview (streamUrl, shouldMute) {
    const webview = document.createElement("webview");
    webview.classList.add("webview", "iframe");
    this.applyDimensions(webview);
    webview.src = streamUrl;

    webview.setAttribute("allow", "autoplay; fullscreen; picture-in-picture; encrypted-media");
    webview.setAttribute("allowsInlineMediaPlayback", "true");
    webview.setAttribute("allowfullscreen", "true");

    // Strip "Electron/x.y.z" from the user agent so YouTube doesn't block embedding.
    const cleanUserAgent = (navigator.userAgent || "").replace(/\s*Electron\/[\d.]+/u, "").trim();
    webview.setAttribute("useragent", cleanUserAgent);

    const origin = this.getOrigin();

    // Set referrer so YouTube's origin check matches the origin parameter in the URL.
    if (origin) {
      webview.setAttribute("httpreferrer", origin);
    }

    if (this.config.webPreferences) {
      webview.setAttribute("webpreferences", this.config.webPreferences);
    }

    this.attachAudioMuteHandler(webview, shouldMute);
    this.attachWebviewFallbackHandlers(webview, streamUrl);

    return webview;
  },

  createIframe (streamUrl) {
    const iframe = document.createElement("iframe");
    iframe.classList.add("iframe");
    this.applyDimensions(iframe);
    iframe.setAttribute("allow", "autoplay; fullscreen; picture-in-picture; encrypted-media");
    iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    iframe.src = streamUrl;

    return iframe;
  },

  applyDimensions (element) {
    element.style.border = "0 none transparent";
    element.style.width = this.config.width;
    element.style.height = this.config.height;
    element.width = this.config.width;
    element.height = this.config.height;
  },

  // --- Webview event handlers ---

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
      Log.warn(`${this.name} switching to iframe fallback (${reason}).`);
      webview.replaceWith(this.createIframe(streamUrl));
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

  // --- Utilities ---

  shouldUseWebview (isElectron) {
    if (!isElectron) {
      return false;
    }

    const element = document.createElement("webview");
    const isWebviewTag = element?.tagName === "WEBVIEW";
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

  getOrigin () {
    if (typeof window !== "undefined" && window.location?.origin) {
      return window.location.origin;
    }
    return null;
  },

  isElectron () {
    return (navigator?.userAgent || "").includes("Electron");
  },

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
