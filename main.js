const { app, BrowserWindow, screen, Tray, Menu, nativeImage } = require('electron')
const path = require('path')

app.commandLine.appendSwitch('enable-transparent-visuals')
app.commandLine.appendSwitch('disable-gpu-compositing')

// Single instance — kill duplicate
if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win = null
let tray = null

// ── Autostart via Electron built-in ──────────────────────────
function setAutostart() {
  app.setLoginItemSettings({
    openAtLogin: true,
    openAsHidden: true,
  })
}

// ── Tray ──────────────────────────────────────────────────────
function createTray() {
  let icon
  const iconPath = path.join(__dirname, 'tray.png')
  try {
    icon = nativeImage.createFromPath(iconPath)
    if (icon.isEmpty()) icon = nativeImage.createEmpty()
  } catch {
    icon = nativeImage.createEmpty()
  }

  tray = new Tray(icon)
  tray.setToolTip('Clock Widget')

  const menu = Menu.buildFromTemplate([
    { label: 'Clock Widget v1.0', enabled: false },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuiting = true
        app.quit()
      }
    }
  ])
  tray.setContextMenu(menu)
}

// ── Window ────────────────────────────────────────────────────
function createWindow() {
  const display = screen.getPrimaryDisplay()
  const { width, height } = display.bounds

  win = new BrowserWindow({
    width,
    height,
    x: display.bounds.x,
    y: display.bounds.y,
    transparent: true,
    frame: false,
    alwaysOnTop: false,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    hasShadow: false,
    show: false,
    focusable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  })

  win.loadFile(path.join(__dirname, 'index.html'))

  win.once('ready-to-show', () => {
    win.showInactive()
    win.setIgnoreMouseEvents(true, { forward: true })
  })

  // Prevent accidental close
  win.on('close', (e) => {
    if (!app.isQuiting) e.preventDefault()
  })
}

app.whenReady().then(() => {
  setAutostart()
  createTray()
  createWindow()
})

app.on('window-all-closed', () => { /* keep alive via tray */ })
app.on('before-quit', () => { app.isQuiting = true })
