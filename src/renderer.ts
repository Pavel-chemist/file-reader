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

const imgeViewElement = document.getElementById('imageView');

let fileHexString: string = '';

btn!.addEventListener('click', async () => {
  console.log('button is clicked');

  const filePathAndData: string[] = await window.electronAPI.openFile();
  const fileExtension: string = filePathAndData[0].split('.').pop().toLowerCase();
  
  filePathElement!.innerText = filePathAndData[0];

  console.log('file extension:', fileExtension);

  fileHexString = filePathAndData[1];

  if (fileExtension !== 'cr2') {
    convertFileHexString();
    slct!.classList.remove('hide');
  } else {
    fileContentElement!.innerText = 'cr2 files are to be presented as image';
    slct!.classList.add('hide');
  }
  
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



/* 
WARR ArrangeBytesToWords ( CARR charArray )
{
//	cout << "\n---1---\n";
	WARR wordArray;	
	bool reflectRows = true;
//	cout << "\n---2---\n";
	int size = charArray.size;	

//	cout << "\n---3---\n";
	WORD *p_wordArray = new WORD [ size * 8 / 12 ];
	
//	cout << "\n---4---\n";
	WORD b0, b1, b2, b3, b4, b5; 
	WORD w0 = 0, w1 = 0, w2 = 0, w3 = 0;			//12 bits go into each word
	WORD mask = 0x0fff; 
	
	
	int index = 0;
//maybe reflect rows? - do this with switch	
	int rowIndex = 0;
//  4 pixels at a time, IMAGE_WIDTH/4 (930) times per row
//	starting at the end of row, moving backwards to zeroeth pixel, then starting at the end of next row
//	cout << "\n---5---\n";
	for ( int i = 0; i < size; i+=6 )
	{
		b0 = charArray.p_Array[i + 0];
		b1 = charArray.p_Array[i + 1];
		b2 = charArray.p_Array[i + 2];
		b3 = charArray.p_Array[i + 3];
		b4 = charArray.p_Array[i + 4];
		b5 = charArray.p_Array[i + 5];
	/**
	*	Bit packing of sensor data
	*
	*	byte|0       |1       |2       |3       |4       |5       |
	*	pix	|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
	*	0___|3210____|BA987654|________|________|________|________|
	*	1___|____BA98|________|________|76543210|________|________|
	*	2___|________|________|BA987654|________|________|3210____|
	*	3___|________|________|________|________|76543210|____BA98|
	**/
  /*
  w0 = ((b1 << 4) + (b0 >> 4)) & mask;
  w1 = ((b0 << 8) + (b3)) & mask;
  w2 = ((b2 << 4) + (b5 >> 4)) & mask;
  w3 = ((b5 << 8) + (b4)) & mask;
  
  index = i * 2 / 3;
  rowIndex = (index / IMAGE_WIDTH) + 1; //start with row 1
  
  if ( reflectRows )
  {	
    p_wordArray[rowIndex*IMAGE_WIDTH - index%IMAGE_WIDTH - 1] = w0;
    p_wordArray[rowIndex*IMAGE_WIDTH - index%IMAGE_WIDTH - 2] = w1;
    p_wordArray[rowIndex*IMAGE_WIDTH - index%IMAGE_WIDTH - 3] = w2;
    p_wordArray[rowIndex*IMAGE_WIDTH - index%IMAGE_WIDTH - 4] = w3;
    

  }
  else
  {
    p_wordArray[index + 0] = w0;
    p_wordArray[index + 1] = w1;
    p_wordArray[index + 2] = w2;
    p_wordArray[index + 3] = w3;
  }
}
//	cout << "\n---6---\n";
wordArray.isReflected = reflectRows;
wordArray.size = size * 8 / 12;
wordArray.width = IMAGE_WIDTH;
wordArray.height = IMAGE_HEIGHT;
wordArray.name = charArray.name;
wordArray.p_Array = p_wordArray;	

//	cout << "\n---7---\n";
return wordArray;
}

*/