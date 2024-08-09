const crypto = require('crypto');

function getHash(input) {
  return crypto.createHash('md5').update(input).digest('hex');
}

function isOpen(char) {
  return ['b', 'c', 'd', 'e', 'f'].includes(char);
}

function partOne(passcode) {
  const queue = [{ x: 0, y: 0, path: '' }];
  
  while (queue.length > 0) {
    const { x, y, path } = queue.shift();
    
    if (x === target.x && y === target.y) {
      return path;
    }
    
    const hash = getHash(passcode + path).slice(0, 4);
    
    for (let i = 0; i < directions.length; i++) {
      const dir = directions[i];
      const newX = x + dir.x;
      const newY = y + dir.y;
      
      if (newX >= 0 && newX <= 3 && newY >= 0 && newY <= 3 && isOpen(hash[i])) {
        queue.push({ x: newX, y: newY, path: path + dir.char });
      }
    }
  }
  
  return null;
}

function partTwo(passcode) {
  let longestPathLength = 0;

  function explore(x, y, path) {
    if (x === target.x && y === target.y) {
      if (path.length > longestPathLength) {
        longestPathLength = path.length;
      }
      return;
    }

    const hash = getHash(passcode + path).slice(0, 4);

    for (let i = 0; i < directions.length; i++) {
      const dir = directions[i];
      const newX = x + dir.x;
      const newY = y + dir.y;

      if (newX >= 0 && newX <= 3 && newY >= 0 && newY <= 3 && isOpen(hash[i])) {
        explore(newX, newY, path + dir.char);
      }
    }
  }

  explore(0, 0, '');
  return longestPathLength;
}

const passcode = 'bwnlcvfs';
const target = { x: 3, y: 3 };

const directions = [
  { x:  0, y: -1, char: 'U' },
  { x:  0, y:  1, char: 'D' },
  { x: -1, y:  0, char: 'L' },
  { x:  1, y:  0, char: 'R' }
];

const shortestPath = partOne(passcode);
console.log('Shortest path to the vault:', shortestPath);

const longestPathLength = partTwo(passcode);
console.log('Length of the longest path to the vault:', longestPathLength);