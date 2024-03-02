const fs = require('fs');

function partOne(instructions) {
  let x = 0;
  let y = 0;
  let direction = 'N';

  const directions = {
    N: { L: 'W', R: 'E', x: 0, y: 1 },
    E: { L: 'N', R: 'S', x: 1, y: 0 },
    S: { L: 'E', R: 'W', x: 0, y: -1 },
    W: { L: 'S', R: 'N', x: -1, y: 0 },
  };

  instructions.forEach(instruction => {
    const turn = instruction.charAt(0);
    const blocks = parseInt(instruction.slice(1));

    direction = directions[direction][turn];

    x += directions[direction].x * blocks;
    y += directions[direction].y * blocks;
  });

  return Math.abs(x) + Math.abs(y);
}

function partTwo(instructions) {
  let x = 0;
  let y = 0;
  let direction ='N';
  let visited = new Set();
  let firstLocationVisitedTwice = null;

  const directions = {
    N: { L: 'W', R: 'E', x: 0, y: 1},
    E: { L: 'N', R: 'S', x: 1, y: 0},
    S: { L: 'E', R: 'W', x: 0, y: -1},
    W: { L: 'S', R: 'N', x: -1, y: 0},
  };

  function updateDirection(turn) {
    direction = directions[direction][turn];
  }

  function moveForward(blocks) {
    for (let i = 0; i < blocks; ++i) {
      x += directions[direction].x;
      y += directions[direction].y;

      const location = `${x}, ${y}`;
      if (visited.has(location) && firstLocationVisitedTwice === null) {
        firstLocationVisitedTwice = Math.abs(x) + Math.abs(y);
      } else {
        visited.add(location);
      }
    }
  }
  
  instructions.forEach(instruction => {
    const turn = instruction.charAt(0);
    const blocks = parseInt(instruction.slice(1));

    updateDirection(turn);
    moveForward(blocks);
  });

  return firstLocationVisitedTwice;
}

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  const instructions = data.trim().split(', ');

  const shortestPath = partOne(instructions);
  const firstLocationVisitedTwice = partTwo(instructions);

  console.log('Shortest way:', shortestPath);
  console.log('First location visited twice:', firstLocationVisitedTwice);
});