const fs = require('fs');

function partOne(instructions) {
  const keypad = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ];

  let x = 1;
  let y = 1;
  let code = "";

  for (let line of instructions) {
    for (let move of line) {
      switch (move) {
        case 'U':
          if (x > 0)
            x -= 1;
          break;
        case 'D':
          if (x < 2)
            x += 1;
          break;
        case 'L':
          if (y > 0)
            y -= 1;
          break;
        case 'R':
          if (y < 2)
            y += 1;
          break;
      }
    }

    code += keypad[x][y];
  }

  return code;
}

function partTwo(instructions) {
  const keypad = [
    [null, null, '1', null, null],
    [null, '2', '3', '4', null],
    ['5', '6', '7', '8', '9'],
    [null, 'A', 'B', 'C', null],
    [null, null, 'D', null, null]
  ];

  let x = 2;
  let y = 0;
  let code = "";

  for (let line of instructions) {
    for (let move of line) {
      switch (move) {
        case 'U':
          if (x > 0 && keypad[x - 1][y] !== null)
            x -= 1;
          break;
        case 'D':
          if (x < 4 && keypad[x + 1][y] !== null)
            x += 1;
          break;
        case 'L':
          if (y > 0 && keypad[x][y - 1] !== null)
            y -= 1;
          break;
        case 'R':
          if (y < 4 && keypad[x][y + 1] !== null)
            y += 1;
          break;  
      }
    }
    code += keypad[x][y];
  }

  return code;
}

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reding file', err);
    return;
  }

  const instructions = data.trim().split('\n');

  const bathroomCode = partOne(instructions);
  const correctBathroomCode = partTwo(instructions);

  console.log('Bathroom code: ', bathroomCode);
  console.log('Correct bathroom code: ', correctBathroomCode)
});