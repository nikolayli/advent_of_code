const fs = require('fs');

function partOne(data) {
  let length = 0;
  let index = 0;

  while (index < data.length) {
    let char = data[index];

    if (char === '(') {
      index++;

      let repeatCount = '';
      while (data[index] !== 'x') {
        repeatCount += data[index];
        index++;
      }
      repeatCount = parseInt(repeatCount, 10);

      index++;

      let repeatTimes = '';
      while (data[index] !== ')') {
        repeatTimes += data[index];
        index++;
      }
      repeatTimes = parseInt(repeatTimes, 10);

      index++;
      length += repeatTimes * repeatCount;
      index += repeatCount;
    } else {
      length++;
      index++;
    }
  }

  return length;
}

function partTwo(data) {
  let char = data[index];

  if (char === '(') {
    index++;

    let repeatCount = '';
    while (data[index] !== 'x') {
      repeatCount += data[index];
      index++;
    }
    repeatCount = parseInt(repeatCount, 10);

    index++;

    let repeatTimes = '';
    while (data[index] !== ')') {
      repeatTimes += data[index];
      index++;
    }
    repeatTimes = parseInt(repeatTimes, 10);

    index++;
    
    let decompressedData = data.substr(index, repeatCount);
    length += repeatTimes * partTwo(decompressedData);
    index += repeatCount; 
  } else {
    length++;
    index++;
  }

  return length;
}

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('Eror reading file: ', err);
    return;
  }

  const decompressedLength = partOne(data);
  const decompressedLength2 = partTwo(data);

  console.log('Decompressed length of the file: ', decompressedLength);
  console.log('Decompressed length of the file using this improved format: ', 
                decompressedLength2);
});