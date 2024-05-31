const fs = require('fs');

let screen = Array.from({ length: 6 }, () =>Array(50).fill('.'));

function partOne(instructions) {
  for (const instruction of instructions) {
    if (instruction.startsWith('rect')) {
      const [width, height] = instruction.match(/\d+/g);
      for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
          screen[row][col] = '#';
        }
      }
    } else if (instruction.startsWith('rotate row')) {
      const [row, shift] = instruction.match(/\d+/g);
      const shiftedRow = screen[row].slice(-shift).concat(screen[row].slice(0, -shift));
      screen[row] = shiftedRow;
    } else if (instruction.startsWith('rotate column')) {
      const [col, shift] = instruction.match(/\d+/g);
      const column = screen.map(row => row[col]);
      const shiftedColumn = column.slice(-shift).concat(column.slice(0, -shift));
      for (let row = 0; row < 6; row++) {
        screen[row][col] = shiftedColumn[row];
      }
    }
  }
  const litPixels = screen.flat().filter(pixel => pixel == '#').length;
  
  return litPixels;
}

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('Error reading file: ', err)
    return;
  }

  const instructions = data.trim().split('\n');

  const pixelsLit = partOne(instructions);

  console.log('Pixels should be lit: ', pixelsLit);

  console.log('Code is the screen trying to display: ')
  console.log(screen.map(row => row.join('')).join('\n'));
});