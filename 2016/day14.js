const crypto = require('crypto');

function md5(input) {
  return crypto.createHash('md5').update(input).digest('hex');
}

function stretchedMd5(input, rounds, cache) {
  if (cache.has(input)) {
    return cache.get(input);
  }

  let hash = input;
  for (let i = 0; i < rounds; i++) {
    hash = md5(hash);
  }
  cache.set(input, hash);

  return hash;
}

function hasTriplet(hash) {
  const match = /(\w)\1\1/.exec(hash);
  return match ? match[1] : null;
}

function hasQuintuplet(hash, char) {
  const regex = new RegExp(`(${char})\\1{4}`);
  return regex.test(hash);
}

function findKeys(salt, keyCount, useStretchedMd5, stretchingRounds) {
  let keys = [];
  let potentialKeys = [];
  let index = 0;
  let hashCache = useStretchedMd5 ? new Map() : null;

  while (keys.length < keyCount) {
    const hash = useStretchedMd5 ? stretchedMd5(salt + index, stretchingRounds, hashCache) : md5(salt + index);
    const tripletChar = hasTriplet(hash);

    if (tripletChar) {
      potentialKeys.push({ index, tripletChar });
    }

    potentialKeys = potentialKeys.filter(potentialKey => {
      if (index - potentialKey.index <= 1000) {
        const checkHash = useStretchedMd5 ? stretchedMd5(salt + index, stretchingRounds, hashCache) : md5(salt + index);
        if (index !== potentialKey.index && hasQuintuplet(checkHash, potentialKey.tripletChar)) {
          keys.push(potentialKey.index);
          return false;
        }
        return true;
      } else {
        return false;
      }
    });
    index++;
  }

  return keys;
}

function partOne(salt, keyCount) {
  return findKeys(salt, keyCount, false, 0);
}

function partTwo(salt, keyCount, stretchingRounds) {
  return findKeys(salt, keyCount, true, stretchingRounds);
}

const salt = 'cuanljph';
const keyCount = 64;
const stretchingRounds = 2017;

const keys = partOne(salt, keyCount);
const stretchingKeys = partTwo(salt, keyCount, stretchingRounds);

console.log('64th key index: ', keys[keyCount - 1]);
console.log('64th key index with stretching: ', stretchingKeys[keyCount - 1]);