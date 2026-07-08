const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("abyssriumDesktop", {
  setMode: (mode) => ipcRenderer.send("reef:set-mode", mode),
  startDrag: (point) => ipcRenderer.send("reef:drag-start", point),
  moveDrag: (point) => ipcRenderer.send("reef:drag-move", point),
  endDrag: () => ipcRenderer.send("reef:drag-end"),
  onGlobalInput: (callback) => {
    const handler = (_event, payload) => callback(payload);
    ipcRenderer.on("reef:global-input", handler);
    return () => ipcRenderer.removeListener("reef:global-input", handler);
  }
});
