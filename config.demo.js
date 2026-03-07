
"use strict";

const config = {
  address: "0.0.0.0",
  port: 8080,
  basePath: "/",
  language: "eo",
  logLevel: ["INFO", "LOG", "WARN", "ERROR", "DEBUG"],
  timeFormat: 24,
  units: "metric",
  electronOptions: {
    webPreferences: {
      webviewTag: true
    }
  },
  modules: [
    {
      module: "clock",
      position: "top_right"
    },
    {
      module: "compliments",
      position: "top_bar",
      config: {
        compliments: {
          anytime: ["If it doesn't work: Did you switch of the Ad Blocker?"]
        }
      }
    },
    {
      module: "MMM-ISS-Live",
      position: "top_left",
      config: {
        url: "https://youtu.be/fO9e9jnhYK8"
      }
    }
  ]
};

/** ************* DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = config;
}
