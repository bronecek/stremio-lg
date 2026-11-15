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

## One-time setup

1. Create a free LG developer account at <https://webostv.developer.lge.com>.
2. On the TV, install **Developer Mode** from the LG Content Store, sign in with that account and turn
   **Dev Mode Status** on. The TV restarts.
3. Open Developer Mode again and turn **Key Server** on. Note the TV's IP address and the passphrase it shows.
4. Register the TV as `tv` (the PC and the TV must be on the same network), fetch its key (this asks for
   the passphrase) and check the connection:

   ```bash
   pnpm exec ares-setup-device --add tv -i "host=<TV_IP>" -i "port=9922" -i "username=prisoner"
   pnpm exec ares-novacom --device tv --getkey
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

A Developer Mode session lasts 50 hours. Extend it with **Extend** in the Developer Mode app on the TV.
When it runs out, the TV removes the apps installed this way; turn Dev Mode on again and run `pnpm deploy:webos`.

## Simulator

The webOS TV 26 Simulator (download it from the webOS TV developer site) runs the same Chromium as the TV,
emulates the remote and fires `cursorStateChange`. The app folder must be the first argument. On Ubuntu 24
the AppImage needs the two flags, which `ares-launch -s` cannot pass:

```bash
./webOS_TV_26_Simulator_1.5.0.AppImage "$PWD/build-webos/app" "{}" --ozone-platform=x11 --no-sandbox
```

## Streaming server

The TV runs no Stremio streaming server. Streams that need one (torrents) play once Settings point the
streaming server URL at a machine that runs it, for example `http://<PC_IP>:11470`. Direct HTTP streams play without it.
