# Clock Widget

A lightweight transparent desktop clock widget built with Electron.  
Displays the current **day**, **date**, and **time** in the Anurati font, floating over your wallpaper.

---

## Features

- Fully transparent — no window, no background, just floating text
- Anurati font bundled locally (no internet needed)
- Sits under all app windows, above the wallpaper
- Click-through — doesn't interfere with anything
- Runs silently in the system tray
- Auto-starts on Windows login

---

## Installation

### Step 1 — Prerequisites
Make sure [Node.js](https://nodejs.org) is installed.

### Step 2 — Build & Install
Double-click **`BUILD.bat`**

It will:
1. Install dependencies (`npm install`)
2. Build the Windows installer
3. Launch the installer automatically

The installer puts the app in `%AppData%\Local\Programs\Clock Widget\`  
and registers it to auto-start on login.

### Alternative — Run without installing
If you just want to run it from the folder without building:

```
npm install
npx electron .
```

Then double-click **`AUTOSTART-ONLY.bat`** to add it to Windows startup via the registry.  
Run **`REMOVE-AUTOSTART.bat`** to remove it.

---

## Usage

| Action | How |
|---|---|
| See the widget | It appears automatically on your desktop |
| Quit | Right-click the tray icon → Quit |
| Uninstall | Settings → Apps → Clock Widget → Uninstall |
| Remove from startup | Settings → Apps → Startup, or run `REMOVE-AUTOSTART.bat` |

---

## Troubleshooting

**Grey/dark background appears after restart**  
This is an Electron transparency timing issue. Fixed in v1.0 via a 150ms compositor delay.  
If it still occurs, try: right-click tray → Quit, then relaunch from Start Menu.

**Font looks wrong / falls back to system font**  
Make sure the `fonts/Anurati.ttf` file is present next to `index.html`.

**Widget doesn't auto-start**  
Run `AUTOSTART-ONLY.bat` as a fallback — it writes directly to the Windows registry startup key.

**Build fails with winCodeSign error**  
The `BUILD.bat` sets `CSC_IDENTITY_AUTO_DISCOVERY=false` to skip code signing.  
If it still fails, run this in the folder then try again:
```
set CSC_IDENTITY_AUTO_DISCOVERY=false
npx electron-builder --win --x64
```

---

## File Structure

```
clock-widget/
├── main.js               Electron main process (window, tray, autostart)
├── index.html            Widget UI (HTML/CSS/JS clock)
├── package.json          Build config
├── icon.ico              App icon
├── tray.png              System tray icon
├── fonts/
│   └── Anurati.ttf       Bundled font (no internet needed)
├── BUILD.bat             One-click build & install
├── AUTOSTART-ONLY.bat    Add to startup without building
└── REMOVE-AUTOSTART.bat  Remove from startup
```

---

## Resource Usage

- **CPU:** ~0% at idle (single `setInterval` at 1000ms)
- **RAM:** ~40–60 MB (typical for an Electron window)
- **Disk:** ~200 MB installed (Electron runtime)
