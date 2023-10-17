export interface IpcApi {
    startAuth: () => Promise<string>
}

export interface ElectronApi {
    openExternal: (string) => void
}

declare global {
    interface Window {
        ipc: IpcApi,
        electron: ElectronApi
    }
}