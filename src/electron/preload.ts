import isDev from 'electron-is-dev';
import { ipcRenderer, shell, contextBridge, autoUpdater, app } from 'electron';

contextBridge.exposeInMainWorld('ipc', {
  startAuth: (): Promise<string> => ipcRenderer.invoke('start-auth'),
});

contextBridge.exposeInMainWorld('electron', {
  openExternal: (url: string) => shell.openExternal(url),
});

contextBridge.exposeInMainWorld('updater', {
  initAutoUpdate: () => {
    if (isDev) {
      return;
    }

    const server = 'https://kazabot-deployment.vercel.app';
    const url = `${server}/update/${process.platform}/${app.getVersion()}`;
    autoUpdater.setFeedURL({ url });

    autoUpdater.checkForUpdates();
    setInterval(() => autoUpdater.checkForUpdates(), 60000);
  },

  addOnDownloaded: (handler: () => void) => {
    autoUpdater.on('update-downloaded', handler);
  },

  removeOnDownloaded: (handler: () => void) => {
    autoUpdater.removeListener('update-downloaded', handler);
  },

  quitAndUpdate: () => autoUpdater.quitAndInstall(),
});
