const { app, BrowserWindow, globalShortcut } = require('electron');
const { clipboard, Tray } = require('electron')
 

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    height: 1000,
    width: 12000,
    show: false,
  });

  mainWindow.loadURL(`file://${__dirname}/index2.html`);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const createClipping = globalShortcut.register('CommandOrControl+!', () => {
    mainWindow.webContents.send('create-new-clipping');
  });

  const writeClipping = globalShortcut.register('CmdOrCtrl+Alt+@', () => {
    mainWindow.webContents.send('write-to-clipboard');
  });
  

  if (!createClipping) {
    console.error('Registration failed', 'createClipping');
  }
  if (!writeClipping) {
    console.error('Registration failed', 'writeClipping');
  }
});
