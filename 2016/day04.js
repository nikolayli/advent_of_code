const fs = require('fs');

function partOne(encryptedList) {
  let sumIDs = 0;

  for (let i = 0; i < encryptedList.length; i++) {
    const room = encryptedList[i];

    const [, encryptedName, sectorID, checksum] = room.match(/([a-z-]+)-(\d+)\[([a-z]+)\]/);

    const name = encryptedName.replace(/-/g, '');
    const letterCount = {};
    for (let j = 0; j < name.length; j++) {
      const letter = name[j];
      letterCount[letter] = letterCount[letter] ? letterCount[letter] + 1 : 1;
    }

    const sortedLetters = Object.keys(letterCount).sort((a, b) => {
      if (letterCount[a] === letterCount[b])
        return a.localeCompare(b);

      return letterCount[b] - letterCount[a];
    });

    const calculatedChecksum = sortedLetters.slice(0, 5).join('');

    if (calculatedChecksum === checksum)
      sumIDs += parseInt(sectorID);
  }

  return sumIDs;
}

function partTwo(encryptedList) {
  for (let i = 0; i < encryptedList.length; ++i) {
    const room = encryptedList[i];

    const [, nameTemp, sectorID] = room.match(/([a-z-]+)-(\d+)/);

    let name = nameTemp.replace(/-/g, ' ');

    let encryptedName = name.replace(/./g, (char) => {
      if (char !== ' ') {
        let charCode = char.charCodeAt(0);
        let shiftedCharCode = ((charCode - 97 + parseInt(sectorID)) % 26) + 97;
        return String.fromCharCode(shiftedCharCode);
      } else {
        return ' ';
      }
    });

    const index = encryptedName.indexOf('north');

    if (index !== -1)
      return sectorID;
  }

  return -1;
}

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('Error reading file: ', err)
    return;
  }

  const encryptedList = data.trim().split('\n');

  const sumIDs = partOne(encryptedList);
  const sectorID = partTwo(encryptedList);

  console.log('Sum of the sector IDs of the real rooms: ', sumIDs);
  console.log('Sector ID of the room where North Pole objects are stored: ', sectorID);
});