'use strict'

const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const { exec } = require('child_process')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Keep a reference for dev mode
let dev = false


const kubeCommand = 'kubectl create namespace monitoring';
const kubeCommand2 = 'kubectl apply -f manifests'

// Run node command to create monitoring namespace for metric scraping
exec(kubeCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`error: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }

  console.log(`stdout:\n${stdout}`);
});

// Run node command to apply all yaml files in manifests
exec(kubeCommand2, (error, stdout, stderr) => {
  if (error) {
    console.error(`error: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }

  console.log(`stdout:\n${stdout}`);
});

if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development') {
  dev = true;
}

// Temporary fix broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
if (process.platform === 'win32') {
  app.commandLine.appendSwitch('high-dpi-support', 'true');
  app.commandLine.appendSwitch('force-device-scale-factor', '1');
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    x: 0,
    y: 0,
    icon: path.resolve(__dirname, '/kr8s.ico'),
    resizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // and load the index.html of the app.
  let indexPath;
  let fileLoader = () => {};

  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = 'http://localhost:8080/index.html';
    fileLoader = mainWindow.loadURL(indexPath);
  } else {
    indexPath = path.join(process.cwd(), 'dist', 'index.html');
    fileLoader = mainWindow.loadFile(indexPath);
  }
  
  console.log('*** indexPath: ', indexPath);
  () => fileLoader;

  // mainWindow.webContents.openDevTools();

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();

    // Open the DevTools automatically if developing
    // if (dev) {
    //   const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')

    //   installExtension(REACT_DEVELOPER_TOOLS)
    //     .catch(err => console.log('Error loading React DevTools: ', err))
    //   mainWindow.webContents.openDevTools()
    // }
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
})