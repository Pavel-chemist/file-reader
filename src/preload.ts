const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => {
    return ipcRenderer.invoke('dialog:openFile');
  },
});