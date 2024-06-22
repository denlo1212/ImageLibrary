const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { openFileDialog } = require("./fileDialog");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;
let secondWindow;

const createMainWindow = () => {
  // Create the main browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: null
  });

  // Maximize the window
  mainWindow.maximize();

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'mainPage/index.html'));
  mainWindow.setMenu(null);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

const createSecondWindow = () => {
  secondWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
  });

  secondWindow.maximize();
  secondWindow.loadFile(path.join(__dirname, 'slideShow/slideShow.html'));
  secondWindow.setMenu(null);

  secondWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === "Escape") {
      closeSecondWindow();
    }
  });

  secondWindow.on('closed', () => {
    secondWindow = null;
  });
};

function closeSecondWindow() {
  if (secondWindow) {
    secondWindow.close();
    secondWindow = null;
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createMainWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('open-file-dialog', () => {
  openFileDialog();
});

ipcMain.on('open-second-window', () => {
  if (!secondWindow) {
    createSecondWindow();
  }
});
