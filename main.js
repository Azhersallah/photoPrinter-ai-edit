const { app, BrowserWindow, ipcMain, shell, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  // Debug: Check if icon file exists
  const iconPath = path.join(__dirname, 'Logo', 'icon.png');
  console.log('Icon path:', iconPath);
  console.log('Icon exists:', fs.existsSync(iconPath));

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js')
    },
    title: 'Photo Printer App',
    show: false
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.loadFile('index.html');

  // Enable developer tools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Confirmation dialog before closing
  mainWindow.on('close', (e) => {
    const choice = dialog.showMessageBoxSync(mainWindow, {
      type: 'question',
      buttons: ['Yes', 'No'],
      title: 'Confirm',
      message: 'Are you sure you want to quit?',
      detail: 'Any unsaved changes will be lost.',
      defaultId: 1, // Default button is 'No'
      cancelId: 1 // If user cancels, behave like 'No'
    });
    // If the user chose 'No' (index 1), prevent the window from closing
    if (choice === 1) {
      e.preventDefault();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  setupMenu();
  setupPrintHandlers();
  setupContextMenu();
  setupSecurityHandlers();
}

function setupMenu() {
  const menu = Menu.buildFromTemplate([]);
  Menu.setApplicationMenu(menu);
  
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.key.toLowerCase() === 'p' && input.type === 'keyDown') {
      event.preventDefault();
      mainWindow.webContents.send('print-request');
    }
  });
}

function setupContextMenu() {
  mainWindow.webContents.on('context-menu', async (event, params) => {
    const hasSelection = params.selectionText?.trim().length > 0;
    const template = [
      { 
        role: 'cut', 
        enabled: hasSelection && params.isEditable
      },
      { 
        role: 'copy', 
        enabled: hasSelection
      },
      { 
        role: 'paste', 
        enabled: params.isEditable
      }
    ];

    const contextMenu = Menu.buildFromTemplate(template);
    contextMenu.popup({ window: mainWindow });
  });
}

function setupPrintHandlers() {
  ipcMain.handle('print-page', handlePrint);
  ipcMain.handle('print-to-pdf', handlePrintToPDF);
  ipcMain.handle('custom-print', handleCustomPrint);
  ipcMain.handle('get-printers', handleGetPrinters);
  ipcMain.handle('print-with-printer', handlePrintWithPrinter);
}

async function handlePrint() {
  try {
    const options = {
      silent: false,
      printBackground: true,
      color: true,
      margins: { marginType: 'default' }
    };
    
    const { success, error } = await mainWindow.webContents.print(options);
    return { success, error };
  } catch (error) {
    console.error('Print error:', error);
    return { success: false, error: error.message };
  }
}

async function handlePrintToPDF() {
  try {
    const pdfPath = path.join(app.getPath('temp'), 'temp-print.pdf');
    const data = await mainWindow.webContents.printToPDF({
      printBackground: true,
      margins: { marginType: 'default' },
      pageSize: 'A4'
    });
    
    await fs.promises.writeFile(pdfPath, data);
    await shell.openPath(pdfPath);
    
    return { success: true, path: pdfPath };
  } catch (error) {
    console.error('PDF Print error:', error);
    return { success: false, error: error.message };
  }
}

async function handleCustomPrint(event, options = {}) {
  try {
    const printOptions = {
      silent: false,
      printBackground: true,
      color: true,
      margins: { marginType: 'default' },
      ...options
    };

    const { success, error } = await mainWindow.webContents.print(printOptions);
    return { success, error };
  } catch (error) {
    console.error('Custom print error:', error);
    return { success: false, error: error.message };
  }
}

async function handleGetPrinters() {
  try {
    const printers = mainWindow.webContents.getPrinters();
    return { success: true, printers };
  } catch (error) {
    console.error('Get printers error:', error);
    return { success: false, error: error.message };
  }
}

async function handlePrintWithPrinter(event, printerName) {
  try {
    const options = {
      silent: true,
      printBackground: true,
      deviceName: printerName,
      color: true
    };

    const { success, error } = await mainWindow.webContents.print(options);
    return { success, error };
  } catch (error) {
    console.error('Printer-specific print error:', error);
    return { success: false, error: error.message };
  }
}

function setupSecurityHandlers() {
  app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
  });

  app.on('web-contents-created', (event, contents) => {
    contents.on('new-window', (navigationEvent, navigationUrl) => {
      navigationEvent.preventDefault();
      shell.openExternal(navigationUrl);
    });
  });
}

app.whenReady().then(createWindow);

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

app.on('before-quit', () => {
  const tempPdfPath = path.join(app.getPath('temp'), 'temp-print.pdf');
  if (fs.existsSync(tempPdfPath)) {
    fs.unlinkSync(tempPdfPath);
  }
});