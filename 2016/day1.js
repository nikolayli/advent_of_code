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

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  const instructions = data.trim().split(', ');

  const shortestPath = partOne(instructions);
  console.log('Shortest way:', shortestPath);
})