import { UpdateApi } from './renderer.d';
import { ipcRenderer, shell, contextBridge } from 'electron';
import { UpdaterEvents } from './ipc-events';

contextBridge.exposeInMainWorld('ipc', {
  startAuth: (): Promise<string> => ipcRenderer.invoke('start-auth'),
});

contextBridge.exposeInMainWorld('electron', {
  openExternal: (url: string) => shell.openExternal(url),
});

const updateApi: UpdateApi = {
  initAutoUpdate: () => {
    console.log('Updating');
    ipcRenderer.send(UpdaterEvents.Init);
  },

  get downloaded() {
    return ipcRenderer.invoke(UpdaterEvents.Downloaded);
  },

  quitAndUpdate: () => ipcRenderer.send(UpdaterEvents.QuitAndUpdate),
};
contextBridge.exposeInMainWorld('updater', updateApi);

