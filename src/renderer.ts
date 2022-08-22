// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const btn = document.getElementById('btn');
const slct = document.getElementById('views') as HTMLSelectElement;
let view: string = 'ascii';

const filePathElement = document.getElementById('filePath');
const fileContentElement = document.getElementById('fileContent');

let fileHexString: string = '';

btn!.addEventListener('click', async () => {
  console.log('button is clicked');

  const filePathAndData = await window.electronAPI.openFile();
  
  filePathElement!.innerText = filePathAndData[0];

  fileHexString = filePathAndData[1];
  convertFileHexString();
});

slct!.addEventListener('input', () => {
  view = slct.value;

  convertFileHexString();
});

function convertFileHexString() {
  switch (view) {
    case 'ascii': fileContentElement!.innerText = hexStringToAscii(fileHexString); break;
    case 'hex': fileContentElement!.innerText = fileHexString; break;
    case 'byte': fileContentElement!.innerText = hexStringToBytes(fileHexString); break;
    case 'adv': fileContentElement!.innerText = hexStringToAdvanced(fileHexString); break;
  }
}

function hexStringToAscii(input: string): string {
  let result: string = '';

  for (let i = 0; i < input.length; i+=2 ) {
    result += String.fromCharCode(Number('0x' + input[i] + input[i+1]));
  }

  return result;
}

function hexStringToBytes(input: string): string {
  let numArray: number[] = [];

  for (let i = 0; i < input.length; i+=2 ) {
    numArray.push(Number('0x' + input[i] + input[i+1]));
  }

  return numArray.toString();
}

function hexStringToAdvanced(input: string): string {
  let result: string = '';
  let substringIndex: string;
  let substringHex: string;
  let substringAscii: string;
  let charCode: number;

  if (input.length % 32) {
    const padding: number = input.length % 32;
    for (let i = 0; i < (32 - padding); i++ ){
      input += '0';
    }
  }

  for (let i = 0; i < input.length; i+=32 ) {
    substringIndex = formIndexSubstr(i);
    substringHex = '';
    substringAscii = '';

    for (let j = 0; j < 32; j+=2) {
      substringHex += input[i + j] + input[i + j + 1] + ' ';
      if (j === 14) {
        substringHex += ' ';
      }

      charCode = Number('0x' + input[i + j] + input[i +j + 1]);
      
      charCode > 31 && charCode < 127 || charCode > 160 ? substringAscii += String.fromCharCode(charCode) : substringAscii += String.fromCharCode(0);
    }

    result += substringIndex + substringHex + ' | ' + substringAscii + '\n';
  }

  return result;
}

function formIndexSubstr(i: number): string {
  let lineNumber: number = (i/32);

  if (lineNumber < 10) {
    return `     ${lineNumber} | `;
  } else if (lineNumber < 100) {
    return `    ${lineNumber} | `;
  } else if (lineNumber < 1000) {
    return `   ${lineNumber} | `;
  } else if (lineNumber < 10000) {
    return `  ${lineNumber} | `;
  } else if (lineNumber < 100000) {
    return ` ${lineNumber} | `;
  } else {
    return `${lineNumber} | `;
  }
}