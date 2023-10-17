import { ipcRenderer, shell, contextBridge } from "electron";

contextBridge.exposeInMainWorld('ipc', {
    startAuth: (): Promise<string> => ipcRenderer.invoke('start-auth')
})

contextBridge.exposeInMainWorld('electron', {
    openExternal: (url: string) => shell.openExternal(url)
})