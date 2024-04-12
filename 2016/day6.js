const fs = require('fs');

function partOne(signals) {
  const messageLength = signals[0].length;
  let result = '';

  for (let i = 0; i < messageLength; i++) {
    const characterCounts = new Map();

    for (const signal of signals) {
      const character = signal[i];
      const count = characterCounts.get(character) || 0;
      characterCounts.set(character, count + 1);
    }

    let mostFrequentCharacter;
    let highestCount = 0;

    for (const [character, count] of characterCounts)
      if (count > highestCount) {
        mostFrequentCharacter = character;
        highestCount = count;
      }

    result += mostFrequentCharacter;
  }

  return result;
}

function partTwo(signals) {
  const messageLength = signals[0].length;
  let result = '';

  for (let i = 0; i < messageLength; i++) {
    const characterCounts = new Map();

    for (const signal of signals) {
      const character = signal[i];
      const count = characterCounts.get(character) || 0;
      characterCounts.set(character, count + 1);
    }

    let leastCommonCharacter;
    let lowestCount = Infinity;

    for (const [character, count] of characterCounts) {
      if (count < lowestCount) {
        leastCommonCharacter = character;
        lowestCount = count;
      }
    }

    result += leastCommonCharacter;
  }

  return result;
}

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('Error reading file: ', err);
    return;
  }

  const signal = data.trim().split('\n');

  const correctedVersion = partOne(signal);
  const correctedVersion2 = partTwo(signal);

  console.log('The error-corrected version of the message:', correctedVersion);
  console.log('The original message:', correctedVersion2);
});