const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { openFileDialog } = require("./fileDialog");
const library = require("./imageHandling/imageLibrary");

let mainWindow;
let secondWindow;

function createMainWindow() {
  // Create the main browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  // Maximize the window
  mainWindow.maximize();

  // Load the main page HTML file
  mainWindow.loadFile(path.join(__dirname, 'mainPage/index.html'));

  // Open the DevTools (optional, remove in production)
  mainWindow.webContents.openDevTools();

  // Handle window closed event
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createSecondWindow(tags) {
  secondWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  // secondWindow.webContents.openDevTools();
  secondWindow.maximize();
  secondWindow.loadFile(path.join(__dirname, 'slideShow/slideShow.html'));
  secondWindow.setMenu(null);

  secondWindow.on('closed', () => {
    secondWindow = null;
  });

  // Send images to the second window when ready
  secondWindow.webContents.on('did-finish-load', () => {
    library.restoreDefault();
    library.filterImages(tags)
    const images = library.getImages()
    secondWindow.webContents.send('image-data', images);
  });

  // Handle escape key press to close the second window
  secondWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === "Escape") {
      closeSecondWindow();
    }
  });
}

function closeSecondWindow() {
  if (secondWindow) {
    secondWindow.close();
    secondWindow = null;
  }
}

// Electron app ready event
app.whenReady().then(() => {
  createMainWindow();

  // Handle app activate event (typically for macOS)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// Quit app when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handler to open file dialog
ipcMain.on('open-file-dialog', () => {
  openFileDialog();
});


ipcMain.on('open-second-window', (event, tags) => {
  if (!secondWindow) {
    createSecondWindow(tags);
  }
});
