# MMM-ISS-Live

**MMM-ISS-Live** is module for [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror) to display a live video stream from the International Space Station.

Live video from the International Space Station includes internal views when the crew is on-duty and Earth views at other times. The video is accompanied by audio of conversations between the crew and Mission Control. This video is only available when the space station is in contact with the ground.

During "loss of signal" periods, viewers will see a blue screen. Since the station orbits the Earth once every 90 minutes, it experiences a sunrise or a sunset about every 45 minutes. When the station is in darkness, external camera video may appear black, but can sometimes provide spectacular views of lightning or city lights below.

## Screenshots

![Screenshot 1](images/screenshot1.png) ![Screenshot 2](images/screenshot2.png)

## Installation

Go to the directory where the modules are stored and download this module by using `git clone`:

```bash
cd ~/MagicMirror/modules
git clone https://github.com/KristjanESPERANTO/MMM-ISS-Live
```

## Update

Go to the module’s directory and pull the latest version from GitHub:

```bash
cd ~/MagicMirror/modules/MMM-ISS-Live
git pull
```

## Configuration

### Easy example

```js
    {
      module: "MMM-ISS-Live",
      position: "bottom_left"
    },
```

### Adapted example

```js
    {
      module: "MMM-ISS-Live",
      header: "ISS Live Stream", // With header
      position: "bottom_left",
      config: {
        url: "https://www.youtube.com/embed/fO9e9jnhYK8", // Default stream
        height: "540px",         // Double height than default
        width: "960px",          // Double width than default
        mute: true,              // Sound disabled
        updateInterval: 24 * 60 * 60 * 1_000 // Stream reconnect interval
      }
    },
```

### Configuration options

| Option           | Type      | Default                                     | Description                                                                           |
| ---------------- | --------- | ------------------------------------------- | ------------------------------------------------------------------------------------- |
| `url`            | `string`  | `https://www.youtube.com/embed/fO9e9jnhYK8` | YouTube stream URL.                                                                   |
| `height`         | `string`  | `"270px"`                                   | Video height.                                                                         |
| `width`          | `string`  | `"480px"`                                   | Video width.                                                                          |
| `animationSpeed` | `number`  | `0`                                         | DOM update animation duration in milliseconds.                                        |
| `updateInterval` | `number`  | `86_400_000`                                | Stream reconnect interval in milliseconds.                                            |
| `mute`           | `boolean` | `true`                                      | Mute the stream when running in Electron.                                             |
| `showErrors`     | `boolean` | `true`                                      | Show a message below the player if the video does not play. Errors are always logged. |
| `webPreferences` | `string`  | `"autoplayPolicy=no-user-gesture-required"` | Electron webview preferences.                                                         |

### Preparing Electron

MagicMirror² disables the `<webview>` tag by default. Enable it by adding the following snippet to your `config/config.js`:

```js
let config = {
  ...
  electronOptions: {
    webPreferences: {
      webviewTag: true;
    }
  },
  ...
}
```

If the tag stays disabled, the module automatically falls back to the iframe renderer.

### Docker / Browser notes

- The module adds an `origin` query parameter and sets `referrerpolicy="strict-origin-when-cross-origin"` on the iframe in browser/server mode. This helps prevent the YouTube "Video player configuration error (153)".
- If you still see player errors, check your browser dev tools for Content Security Policy (CSP) violations. Your server's CSP must allow connections to YouTube and Google Video domains, e.g.:
  - `frame-src`: `https://www.youtube.com` `https://www.youtube-nocookie.com`
  - `connect-src`/`media-src`: `https://*.youtube.com` `https://*.googlevideo.com`

  Configure this in your reverse proxy or MagicMirror server headers as appropriate.

### Other streams

The default stream is _Live 4K video of Earth and space_ by Sen, filmed from cameras on the ISS. You can use another YouTube video by setting its URL in the `url` option, provided its owner allows embedding. Regular YouTube URLs (`youtube.com/watch?v=…` or `youtu.be/…`) are automatically converted to embed URLs.

## Troubleshooting

### WebGL / SwiftShader error on Raspberry Pi

On Raspberry Pi (and other devices without hardware GPU acceleration) you may see the following error in the MagicMirror log:

```text
Automatic fallback to software WebGL has been deprecated. Please use the --enable-unsafe-swiftshader flag to opt in to lower security guarantees for trusted content.
```

To fix this, add `"enable-unsafe-swiftshader"` to the `electronSwitches` array in your `config/config.js`:

```js
let config = {
  // ...
  electronSwitches: ["enable-unsafe-swiftshader"]
  // ...
};
```

### Video shows "Playback on other websites has been disabled by the video owner"

If you use a custom stream URL, its owner may have disabled embedding. Try the default stream or choose another video that allows embedding.

## Project status

Since the original module didn't work anymore and the author, [Mykle1](https://github.com/Mykle1), is no longer active, I forked the module. I fixed a few issues and will try to keep the module working in the future.

**This module is in maintenance mode.**

## Known issues

If you use pi-hole or any other ad blocker, you may need to whitelist some ad URLs to get the video stream working. Check out the browser console for the URL(s).

## Contributing

If you find any problems, bugs or have questions, please [open a GitHub issue](https://github.com/KristjanESPERANTO/MMM-ISS-Live/issues) in this repository.

Pull requests are of course also very welcome 🙂

### Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

### Developer commands

- `npm install` - Install development dependencies.
- `node --run demo` - Start MagicMirror with the demo configuration.
- `node --run lint` - Run linting and formatter checks.
- `node --run lint:fix` - Fix linting and formatter issues.
- `node --run test` - Run linting and formatter checks + Run spelling check.
- `node --run test:spelling` - Run spelling check.
