const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').trim();

const isTrap = (left, center, right) => {
  return (left === '^' && center === '^' && right === '.') ||
         (left === '.' && center === '^' && right === '^') ||
         (left === '^' && center === '.' && right === '.') ||
         (left === '.' && center === '.' && right === '^')
};

const generateNextRow = (currentRow) => {
  let nextRow = '';
  for (let  i = 0; i < currentRow.length; i++) {
    const left = i > 0 ? currentRow[i - 1] : '.';
    const center = currentRow[i];
    const right = i < currentRow.length - 1 ? currentRow[i + 1] : '.';
    nextRow += isTrap(left, center, right) ? '^' : '.';
  }

  return nextRow;
};

const countSafeTiles = (row) => {
  return row.split('').filter(tile => tile === '.').length;
};

const solve = (initialRow, totalRows) => {
  let currentRow = initialRow;
  let safeTileCount = countSafeTiles(currentRow);

  for (let i = 1; i < totalRows; i++) {
    currentRow = generateNextRow(currentRow);
    safeTileCount += countSafeTiles(currentRow);
  }

  return safeTileCount;
};

const totalRowsPartOne = 40;
const totalRowsPartTwo = 400000;

const resultPartOne = solve(input, totalRowsPartOne);
const resultPartTwo = solve(input, totalRowsPartTwo);

console.log(`Number of safe tiles in 40 rows: ${resultPartOne}`);
console.log(`Number of safe tiles in 400000 rows: ${resultPartTwo}`);