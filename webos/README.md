# Stremio for LG webOS TV

An unofficial build of this web app as a packaged webOS TV app (`.ipk`), installed through Developer Mode.
It targets webOS TV 26 (Chromium 132) and is driven with the Magic Remote pointer.

## What the webOS build changes

`pnpm build:webos` runs webpack with `--env webos`, which:

- writes the app to `build-webos/app` instead of `build`;
- leaves out the Workbox service worker and does not register one (`SERVICE_WORKER_DISABLED`);
- leaves out the Google Cast sender script (a protocol-relative URL does not resolve from `file://`);
- sets `process.env.WEBOS`, which the webOS-only code checks.

The script then copies `appinfo.json` (with the version from `package.json`) and the icons, and packs
`build-webos/com.bronec.stremio_<version>_all.ipk` with `ares-package`.

## On the TV

- Everything is drawn at 150 % (on top of the account's interface scale, which other devices share) so it
  reads from the sofa. There is no fullscreen toggle and no volume control in the player: the TV is always
  full screen and its remote sets the volume.
- The Magic Remote is a mouse: OK clicks what the cursor points at, the wheel scrolls. Pointer and hover
  media queries are answered like a desktop's at build time (`postcss-desktop-pointer.js`), and holding OK
  does not act as a touch long press.
- Back closes an open popup, menu, dropdown or dialog, otherwise goes back; on the Board it asks to exit.
- In the player the arrows seek and change the volume, OK after an arrow plays or pauses, the media keys
  (415 play, 19 pause, 413 stop, 417 fast-forward, 412 rewind) do what they say, CH ▼ hides the controls
  at once and CH ▲ shows them. The controls leave when the system hides the cursor (`cursorStateChange`,
  key code 1537), even while it rests on them. The app never hides the cursor itself: after
  `PalmSystem.setCursor("blank")` a webOS TV 26 set stops delivering pointer events.
- Playback goes through stremio-video's `WebOsVideo`, which switches the TV player's audio and subtitle
  tracks; `runtime/webOSService.js` gives it `window.webOS.service` without bundling webOSTV.js.
- Settings > Shortcuts lists the remote and opens a remote tester that shows each key's code, the cursor
  and keyboard events and the pointer type.
- "Log in with your phone" on the intro page shows a QR code and a code from link.stremio.com; signing in
  on the phone signs the TV in. The intro page does not focus the email field on its own, which would open
  the on-screen keyboard.
- The account's addons, user and library are pulled whenever the app comes back to the foreground, and
  the Addons page has "Sync addons from account" (signed in only).

## One-time setup

1. Create a free LG developer account at <https://webostv.developer.lge.com>.
2. On the TV, install **Developer Mode** from the LG Content Store, sign in with that account and turn
   **Dev Mode Status** on. The TV restarts.
3. Open Developer Mode again and turn **Key Server** on. Note the TV's IP address and the passphrase it shows.
4. Register the TV as `tv` (the PC and the TV must be on the same network), fetch its key with the
   passphrase and check the connection:

   ```bash
   pnpm exec ares-setup-device --add tv -i "host=<TV_IP>" -i "port=9922" -i "username=prisoner"
   pnpm exec ares-novacom --device tv --getkey --passphrase <PASSPHRASE>
   pnpm exec ares-device --device tv --system-info
   ```

## Build, install, debug

```bash
pnpm build:webos
pnpm deploy:webos
```

`deploy:webos` installs the `.ipk` with `ares-install` and starts it with `ares-launch`. Set `WEBOS_DEVICE`
to use another device name than `tv`.

To open DevTools for the app running on the TV:

```bash
pnpm exec ares-inspect --device tv --app com.bronec.stremio --open
```

## Developer Mode session

The Developer Mode app shows how long the session has left ("Dev Mode Session"; about 1000 hours on a
webOS TV 26 set, 50 hours on older ones) and extends it. When it runs out, the TV removes the apps
installed this way; turn Dev Mode on again and run `pnpm deploy:webos`.

## Simulator

The webOS TV 26 Simulator (download it from the webOS TV developer site) runs the same Chromium as the TV,
emulates the remote and fires `cursorStateChange`. The app folder must be the first argument. On Ubuntu 24
the AppImage needs the two flags, which `ares-launch -s` cannot pass:

```bash
./webOS_TV_26_Simulator_1.5.0.AppImage "$PWD/build-webos/app" "{}" --ozone-platform=x11 --no-sandbox
```

Add `--remote-debugging-port=9333` to drive the app and the simulated remote over the DevTools protocol.
The simulator has no H.264 decoder and no TV media pipeline: test playback with a VP9 WebM stream, and
check audio tracks, embedded subtitles, HDR and Dolby Vision on the TV.

## Streaming server

The TV runs no Stremio streaming server. Streams that need one (torrents) play once Settings point the
streaming server URL at a machine that runs it, for example `http://<PC_IP>:11470`. Direct HTTP streams play without it.
