const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf-8').trim().split('\n');

const swapPosition = (str, x, y) => {
  const arr = str.split('');
  [arr[x], arr[y]] = [arr[y], arr[x]];
  return arr.join('');
};

const swapLetter = (str, x, y) => {
  return str.split('').map(char => {
    if (char === x) return y;
    if (char === y) return x;
    return char;
  }).join('');
};

const rotateLeft = (str, steps) => {
  const len = str.length;
  steps = steps % len;
  return str.slice(steps) + str.slice(0, steps);
};

const rotateRight = (str, steps) => {
  const len = str.length;
  steps = steps % len;
  return str.slice(len - steps) + str.slice(0, len - steps);
};

const rotateBasedOnPosition = (str, x) => {
  const index = str.indexOf(x);
  let steps = 1 + index;
  if (index >= 4) steps += 1;
  return rotateRight(str, steps);
};

const reversePositions = (str, x, y) => {
  const arr = str.split('');
  const reversed = arr.slice(x, y + 1).reverse();
  return arr.slice(0, x).concat(reversed).concat(arr.slice(y + 1)).join('');
};

const movePosition = (str, x, y) => {
  const arr = str.split('');
  const [char] = arr.splice(x, 1);
  arr.splice(y, 0, char);
  return arr.join('');
};

const partOne = (password, instructions) => {
  instructions.forEach(instruction => {
    const parts = instruction.split(' ');

    if (parts[0] === 'swap' && parts[1] === 'position') {
      const x = parseInt(parts[2], 10);
      const y = parseInt(parts[5], 10);
      password = swapPosition(password, x, y);
    } else if (parts[0] === 'swap' && parts[1] === 'letter') {
      const x = parts[2];
      const y = parts[5];
      password = swapLetter(password, x, y);
    } else if (parts[0] === 'rotate' && parts[1] === 'left') {
      const steps = parseInt(parts[2], 10);
      password = rotateLeft(password, steps);
    } else if (parts[0] === 'rotate' && parts[1] === 'right') {
      const steps = parseInt(parts[2], 10);
      password = rotateRight(password, steps);
    } else if (parts[0] === 'rotate' && parts[1] === 'based') {
      const x = parts[6];
      password = rotateBasedOnPosition(password, x);
    } else if (parts[0] === 'reverse') {
      const x = parseInt(parts[2], 10);
      const y = parseInt(parts[4], 10);
      password = reversePositions(password, x, y);
    } else if (parts[0] === 'move') {
      const x = parseInt(parts[2], 10);
      const y = parseInt(parts[5], 10);
      password = movePosition(password, x, y);
    }
  });

  return password;
};

const partTwo = (password, instructions) => {
  instructions.reverse().forEach(instruction => {
    const parts = instruction.split(' ');

    if (parts[0] === 'swap' && parts[1] === 'position') {
      const x = parseInt(parts[2], 10);
      const y = parseInt(parts[5], 10);
      password = swapPosition(password, x, y);
    } else if (parts[0] === 'swap' && parts[1] === 'letter') {
      const x = parts[2];
      const y = parts[5];
      password = swapLetter(password, x, y);
    } else if (parts[0] === 'rotate' && parts[1] === 'left') {
      const steps = parseInt(parts[2], 10);
      password = rotateRight(password, steps);
    } else if (parts[0] === 'rotate' && parts[1] === 'right') {
      const steps = parseInt(parts[2], 10);
      password = rotateLeft(password, steps);
    } else if (parts[0] === 'rotate' && parts[1] === 'based') {
      const x = parts[6];
      const len = password.length;
      const index = password.indexOf(x);
      let steps = 1 + index;
      if (index >= 4) steps += 1;
      for (let i = 0; i < len; i++) {
        const rotated = rotateLeft(password, i);
        if (partOne(rotated, [instruction]) === password) {
          password = rotated;
          break;
        }
      }
    } else if (parts[0] === 'reverse') {
      const x = parseInt(parts[2], 10);
      const y = parseInt(parts[4], 10);
      password = reversePositions(password, x, y);
    } else if (parts[0] === 'move') {
      const x = parseInt(parts[2], 10);
      const y = parseInt(parts[5], 10);
      password = movePosition(password, y, x);
    }
  });

  return password;
};

const scrambledPassword = partOne('abcdefgh', input);
const unscrambledPassword = partTwo('fbgdceah', input);

console.log('Scrambled password:', scrambledPassword);
console.log('Unscrambled password:', unscrambledPassword);