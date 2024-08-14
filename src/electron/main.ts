import isDev from 'electron-is-dev';
import { app, autoUpdater, BrowserWindow, ipcMain, shell } from 'electron';
import installExtension, { APOLLO_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import path from 'path';
import { UpdaterEvents } from './ipc-events';

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
  app.whenReady().then(() => {
    createWindow();

    // Инициализируем проверку обновления
    ipcMain.on(UpdaterEvents.Init, () => {
      handleOnInitUpdate();
    });
  });
}

function createWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  installExtension(APOLLO_DEVELOPER_TOOLS);
  if (isDev) {
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

  return mainWindow;
}

function handleOnInitUpdate() {
  if (isDev) {
    return;
  }

  const server = 'https://update.electronjs.org';
  const url = `${server}/deface-37/Gitlab-Issues-Time-Manager/${
    process.platform
  }/${app.getVersion()}`;

  autoUpdater.setFeedURL({ url });
  setInterval(() => autoUpdater.checkForUpdates(), 60000);
}

ipcMain.handle('start-auth', () => {
  return new Promise((resolve) => {
    app.once('second-instance', (_, argv: string[]) => {
      const url = argv[argv.length - 1];
      resolve(url);
    });
  });
});

// Обрабатываем завершение обновления
ipcMain.handle(UpdaterEvents.Downloaded, (): Promise<void> => {
  return new Promise((resolve) => {
    autoUpdater.once('update-downloaded', () => {
      resolve();
    });
  });
});

// Выходим и обновляем
ipcMain.on(UpdaterEvents.QuitAndUpdate, () => autoUpdater.quitAndInstall());

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
