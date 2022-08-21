// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const btn = document.getElementById('btn');
const filePathElement = document.getElementById('filePath');
const fileContentElement = document.getElementById('fileContent');

let fileBuffer: Buffer;

btn!.addEventListener('click', async () => {
  console.log('button is clicked');

  const filePathAndData = await window.electronAPI.openFile();
  
  filePathElement!.innerText = filePathAndData[0];

  fileBuffer = filePathAndData[1];
  convertFileBufferToString();
});

function convertFileBufferToString() {
  console.log('trying to convert buffer to hex string');
  
  const textRepresentation: string = fileBuffer.toString('hex');

  fileContentElement!.innerText = textRepresentation
}