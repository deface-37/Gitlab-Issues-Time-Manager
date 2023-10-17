import { app, BrowserWindow, ipcMain, shell } from 'electron';
import installExtension, { APOLLO_DEVELOPER_TOOLS } from 'electron-devtools-installer';
// import isDev from 'electron-is-dev';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('update-electron-app')();

if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('gitlab-time-manager', process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient('gitlab-time-manager');
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.whenReady().then(createWindow);
}

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  installExtension(APOLLO_DEVELOPER_TOOLS);
  if (process.defaultApp) {
    mainWindow.webContents.openDevTools({
      mode: 'undocked',
    });
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);

    return { action: 'deny' };
  });

  mainWindow.maximize();
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  app.on('second-instance', () => {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });

  // mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
}

ipcMain.handle('start-auth', () => {
  return new Promise((resolve) => {
    app.once('second-instance', (_, argv: string[]) => {
      const url = argv[argv.length - 1];
      resolve(url);
    });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
