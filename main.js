// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs'); // Load the File System to execute our common tasks (CRUD)

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (canceled) {
    console.log("No file selected");

    return;
  } else {
    const data = ReadFile(filePaths[0]);
    
    return [filePaths[0], data];  
  }
}

function ReadFile(filePath) {
  console.log('path to file to read: ', filePath);

  const readData = fs.readFileSync(filePath, 'utf-8', (err, data) => {
    if(err){
        alert("An error ocurred reading the file :" + err.message);
        return;
    }
    return data;
  });

  return readData;
}

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen);
  // ipcMain.handle('fs:readFile', handleReadFile);

  createWindow();
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
