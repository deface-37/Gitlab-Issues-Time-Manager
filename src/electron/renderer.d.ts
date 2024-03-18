export interface IpcApi {
  startAuth: () => Promise<string>;
}

export interface ElectronApi {
  openExternal: (string) => void;
}

export interface UpdateApi {
  initAutoUpdate: () => void;
  downloaded: Promise<void>;
  quitAndUpdate: () => void;
}

declare global {
  interface Window {
    ipc: IpcApi;
    electron: ElectronApi;
    updater: UpdateApi;
  }
}
