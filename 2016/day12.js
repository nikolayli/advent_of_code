const fs = require('fs')

function executeInstructions(instructions, cValue = 0) {
  const registers = new Map([['a', 0], ['b', 0], ['c', cValue], ['d', 0]]);

  function getValue(x) {
    const parsed = parseInt(x, 10);
    return Number.isNaN(parsed) ? registers.get(x) : parsed;
  }

  for (let ip = 0; ip < instructions.length; ip++) {
    const [instr, x, y] = instructions[ip];

    switch (instr) {
      case 'cpy':
        if (instructions[ip].length === 3 && registers.has(y)) {
          registers.set(y, getValue(x));
        }
        break;
      case 'inc':
      case 'dec':
        if (instructions[ip].length === 2 && registers.has(x)) {
          registers.set(x, registers.get(x) + (instr == 'inc' ? 1 : -1));
        }
        break;
      case 'jnz':
        if (instructions[ip].length === 3 && getValue(x) !== 0) {
          ip += getValue(y) - 1;
        }
        break;
      default:
        console.error(`Unknown instruction: ${instr}`);
        break;
    }
  }

  return Object.fromEntries(registers);
}

function partOne(instructions) {
  return executeInstructions(instructions);
}

function partTwo(instructions) {
  return executeInstructions(instructions, 1);
}

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file: ', err);
    return;
  }

  const instructions = data.split('\n').map(instr => instr.trim().split(' '));

  const valueInRegister  = partOne(instructions);
  const valueInRegister2 = partTwo(instructions);

  console.log('Value left in register a: ', valueInRegister.a);
  console.log('Value left in register a with c initialized to 1: ', valueInRegister2.a);
});