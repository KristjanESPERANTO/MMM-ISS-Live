/* global Log Module */

/*
 * MagicMirror²
 * Module: MMM-ISS-Live
 *
 * By Mykle1 - MIT Licensed
 *
 */

Module.register("MMM-ISS-Live", {
  defaults: {
    height: "270px",
    width: "480px",
    animationSpeed: 0,
    updateInterval: 60 * 60 * 1_000,
    mute: true
  },
  start () {
    setInterval(() => {
      this.updateDom(this.config.animationSpeed || 0);
    }, this.config.updateInterval);
  },

  getDom () {
    const iframe = document.createElement("iframe");
    iframe.classList.add("iframe");
    iframe.style = "border: 0 none transparent";
    iframe.width = this.config.width;
    iframe.height = this.config.height;

    iframe.src = this.config.url
      ? this.config.url
      : "https://www.youtube.com/embed/OCem0E-0Q6Y?si=ABf9IB2wDLzHxgeW";

    iframe.src += "&autoplay=1";

    if (this.config.mute) {
      iframe.src += "&mute=1";
    }

    return iframe;
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
