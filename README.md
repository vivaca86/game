# Abyssrium Desk

Taskbar-style Abyssrium desktop companion prototype.

## Run On This PC

Install dependencies once:

```powershell
npm install
```

Run as a real Windows desktop overlay:

```powershell
npm run desktop:dev
```

Quit the desktop overlay from the system tray: right-click the Abyssrium Desk tray icon, then choose `종료`. The same menu also has `펼치기`, `접기`, and `위치 다시 맞추기`.

Run the browser mock:

```powershell
npm run dev -- --port 4173
```

Open `http://127.0.0.1:4173/`.

## Build For Another PC

Create a portable Windows build:

```powershell
npm run desktop:pack
```

The packaged app is created under `release/AbyssriumDesk-win-x64/`, and a zip is created at `release/AbyssriumDesk-win-x64.zip`. Send the zip to the other PC, unzip it, and run `Abyssrium Desk.exe`. The other PC does not need Node.js when using the packaged build.

If you send the source project instead, the other PC needs Node.js installed and must run:

```powershell
npm install
npm run desktop:dev
```

## Verification

```powershell
npm run build
npm run test:smoke
```

Compact mode uses a fixed `640px` camera width so the corallite face crop stays consistent across laptop, desktop, and ultra-wide displays.
