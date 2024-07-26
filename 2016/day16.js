function generateData(initialState, length) {
  let data = initialState;

  while (data.length < length) {
    let a = data;
    let b = a.split('')
             .reverse()
             .map(char => char === '0' ? '1' : '0')
             .join('');
    data = a + '0' + b;
  }

  return data.slice(0, length);
}

function calculateChecksum(data) {
  let checksum = data;

  while (checksum.length % 2 === 0) {
    let newChecksum = '';
    for (let i = 0; i < checksum.length; i += 2) {
      newChecksum += (checksum[i] === checksum[i + 1]) ? '1' : '0';
    }
    checksum = newChecksum;
  }

  return checksum;
}

const initialState = '01110110101001000';
const diskLengthOne = 272;
const diskLengthTwo = 35651584;

const diskDataOne = generateData(initialState, diskLengthOne);
const diskDataTwo = generateData(initialState, diskLengthTwo);

const partOne = calculateChecksum(diskDataOne);
const partTwo = calculateChecksum(diskDataTwo);

console.log(`Checksum for disk length ${diskLengthOne}: ${partOne}`);
console.log(`Checksum for disk length ${diskLengthTwo}: ${partTwo}`);