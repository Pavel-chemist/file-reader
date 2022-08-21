// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const btn = document.getElementById('btn');
const filePathElement = document.getElementById('filePath');
const fileContentElement = document.getElementById('fileContent');

btn.addEventListener('click', async () => {
  const filePathAndData = await window.electronAPI.openFile();
  
  console.log('filepath to use for file opening: ', filePathAndData[0]);
  console.log('file contents: ', filePathAndData[1]);
  
  filePathElement.innerText = filePathAndData[0];
  fileContentElement.innerText = filePathAndData[1];
  
});