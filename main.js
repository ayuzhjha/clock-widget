const { app, BrowserWindow, screen, Tray, Menu, nativeImage } = require('electron')
const path = require('path')

// These MUST be set before app is ready for transparency to work on Windows
app.commandLine.appendSwitch('enable-transparent-visuals')
app.commandLine.appendSwitch('disable-gpu')
app.commandLine.appendSwitch('wm-window-animations-disabled')

// Single instance lock
if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win = null
let tray = null

function setAutostart() {
  app.setLoginItemSettings({
    openAtLogin: true,
    openAsHidden: true,
  })
}

function createTray() {
  let icon
  try {
    icon = nativeImage.createFromPath(path.join(__dirname, 'tray.png'))
    if (icon.isEmpty()) icon = nativeImage.createEmpty()
  } catch {
    icon = nativeImage.createEmpty()
  }

  tray = new Tray(icon)
  tray.setToolTip('Clock Widget')
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Clock Widget v1.0', enabled: false },
    { type: 'separator' },
    { label: 'Quit', click: () => { app.isQuiting = true; app.quit() } }
  ]))
}

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
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    hasShadow: false,
    show: false,
    focusable: false,
    type: 'toolbar',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  })

  win.loadFile(path.join(__dirname, 'index.html'))

  win.once('ready-to-show', () => {
    // Small delay so the compositor has time to initialize transparency
    setTimeout(() => {
      win.showInactive()
      win.setIgnoreMouseEvents(true, { forward: true })
    }, 300)
  })

  win.on('close', (e) => {
    if (!app.isQuiting) e.preventDefault()
  })

  // Prevent minimize via keyboard shortcuts or system events
  win.on('minimize', () => {
    win.restore()
  })
}

app.whenReady().then(() => {
  setAutostart()
  createTray()
  createWindow()
})

app.on('window-all-closed', () => { /* keep alive via tray */ })
app.on('before-quit', () => { app.isQuiting = true })
