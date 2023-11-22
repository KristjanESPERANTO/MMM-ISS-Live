# MMM-ISS-Live

- Displays live video from the International Space Station.
- Audio from the ISS (when available).

Live video from the International Space Station includes internal views when the crew is on-duty and Earth views at other times. The video is accompanied by audio of conversations between the crew and Mission Control. This video is only available when the space station is in contact with the ground.

During "loss of signal" periods, viewers will see a blue screen. Since the station orbits the Earth once every 90 minutes, it experiences a sunrise or a sunset about every 45 minutes. When the station is in darkness, external camera video may appear black, but can sometimes provide spectacular views of lightning or city lights below.

## Examples

The module is a live stream. These are still shots, obviously.

![Screenshot 1](images/i1.png) ![Screenshot 2](images/i33.png)

## Installation

- `git clone https://github.com/KristjanESPERANTO/MMM-ISS-Live` into the `~/MagicMirror/modules` directory.

## Config.js entry and options

### Easy example

```js
    {
      module: "MMM-ISS-Live",
      position: "bottom left"
    },
```

### Adapted example

```js
    {
      module: "MMM-ISS-Live",
      header: "ISS Live Sream",   // With header
      position: "bottom left",
      config: {
        height: "540px",        // Double height than default
        width: "960px",         // Double width than default
        mute: false             // Sound enabled
      }
    },
```

## Project status

Since the original module didn't work anymore and the author, [Mykle1](https://github.com/Mykle1), is no longer active, I forked the module. I fixed a few issues and will try to keep the module working in the future.

But **this module is in maintenance mode.** So I'm not planning any functional changes. If someone wants to take over the further development, I would be happy. PR's are welcome too!
