const fs = require('fs');

function parseInput() {
  const file = fs.readFileSync('input.txt', 'utf-8');
  return file.trim().split('\n').map(line => line.split(' '));
}

function execute(instructions, initialA) {
  const registers = { a: initialA, b: 0, c: 0, d: 0 };
  let output = [];
  let pc = 0;

  while (pc < instructions.length) {
    const [op, x, y] = instructions[pc];

    const getValue = (v) => (isNaN(v) ? registers[v] : parseInt(v, 10));

    switch (op) {
      case 'cpy':
        if (isNaN(y)) registers[y] = getValue(x);
        break;
      case 'inc':
        registers[x]++;
        break;
      case 'dec':
        registers[x]--;
        break;
      case 'jnz':
        if (getValue(x) !== 0) pc += getValue(y) - 1;
        break;
      case 'out':
        output.push(getValue(x));
        if (output.length > 20) return output;
        break;
      default:
        throw new Error(`Unknown operation ${op}`);
    }
    pc++;
  }

  return output;
}

function isClockSignal(output) {
  for (let i = 0; i < output.length; i++) {
    if (output[i] !== i % 2) {
      return false;
    }
  }

  return true;
}

function findSmallestA(instructions) {
  let a = 1;
  while (true) {
    const output = execute(instructions, a);
    if (isClockSignal(output)) {
      return a;
    }
    a++;
  }
}

const instructions = parseInput();

const lowestPositiveInteger = findSmallestA(instructions);

console.log(`The smallest positive integer for register a is: ${lowestPositiveInteger}`);