const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("abyssriumDesktop", {
  setMode: (mode) => ipcRenderer.send("reef:set-mode", mode),
  onGlobalInput: (callback) => {
    const handler = (_event, payload) => callback(payload);
    ipcRenderer.on("reef:global-input", handler);
    return () => ipcRenderer.removeListener("reef:global-input", handler);
  }
});
