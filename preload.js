const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  printPage: () => ipcRenderer.invoke('print-page'),
  printToPDF: () => ipcRenderer.invoke('print-to-pdf'),
  customPrint: (options) => ipcRenderer.invoke('custom-print', options),
  getPrinters: () => ipcRenderer.invoke('get-printers'),
  printWithPrinter: (printerName) => ipcRenderer.invoke('print-with-printer', printerName),
  showError: (message) => ipcRenderer.send('show-error', message)
});

// Handle print shortcut from main process
ipcRenderer.on('print-request', () => {
  window.postMessage({ type: 'print-request' }, '*');
});