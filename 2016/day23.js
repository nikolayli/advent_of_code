const fs = require('fs');

function parseInstr(s) {
  return s.map((val, index) => {
    if (index === 0) {
      return val;
    } else if (val === 'a') {
      return 0;
    } else if (val === 'b') {
      return 1;
    } else if (val === 'c') {
      return 2;
    } else if (val === 'd') {
      return 3;
    } else {
      return `#${val}`;
    }
  });
}

function loadInstrs(src) {
  const instructions = [];
  const lines = fs.readFileSync(src, 'utf-8').split('\n');
  for (const line of lines) {
    if (line.trim()) {
      const s = line.trim().split(' ');
      const instr = parseInstr(s);
      instructions.push(instr);
    }
  }
  
  return instructions;
}

function execProgram(instructions, initRegs) {
  let pc = 0;
  const regs = [...initRegs];
  while (pc >= 0 && pc < instructions.length) {
    const instr = instructions[pc];
    switch (instr[0]) {
      case 'cpy': {
        const x = instr[1];
        const y = instr[2];
        if (typeof y === 'number') {
          const valX = typeof x === 'number' ? regs[x] : parseInt(x.slice(1));
          regs[y] = valX;
        }
        pc++;
        break;
      }
      case 'inc': {
        if (pc > 0 && (pc + 4) < instructions.length &&
            instructions[pc + 1][0] === 'dec' &&
            instructions[pc + 2][0] === 'jnz' &&
            instructions[pc + 1][1] === instructions[pc + 2][1] &&
            instructions[pc + 2][2] === '#-2' &&
            instructions[pc + 3][0] === 'dec' &&
            instructions[pc + 4][0] === 'jnz' &&
            instructions[pc + 3][1] === instructions[pc + 4][1] &&
            instructions[pc + 4][2] === '#-5' &&
            instructions[pc - 1][0] === 'cpy' &&
            instructions[pc - 1][2] === instructions[pc + 1][1]) {
          const x = instr[1];
          const z = instructions[pc + 1][1];
          const w = instructions[pc + 3][1];
          if (typeof x === 'number' && typeof z === 'number' && typeof w === 'number') {
            regs[x] += regs[z] * regs[w];
            regs[z] = 0;
            regs[w] = 0;
          }
          pc += 5;
        } else {
          const x = instr[1];
          if (typeof x === 'number') {
            regs[x]++;
          }
          pc++;
        }
        break;
      }
      case 'dec': {
        const x = instr[1];
        if (typeof x === 'number') {
          regs[x]--;
        }
        pc++;
        break;
      }
      case 'jnz': {
        const x = instr[1];
        const y = instr[2];
        const valX = typeof x === 'number' ? regs[x] : parseInt(x.slice(1));
        const valY = typeof y === 'number' ? regs[y] : parseInt(y.slice(1));
        if (
          valX !== 0 && 
          (pc + valY) >= 0 && 
          (pc + valY) < instructions.length
        ) {
          pc += valY;
        } else {
          pc++;
        }
        break;
      }
      case 'tgl': {
        const x = instr[1];
        const valX = typeof x === 'number' ? regs[x] : parseInt(x.slice(1));
        if ((pc + valX) >= 0 && (pc + valX) < instructions.length) {
          const instrToTgl = instructions[pc + valX];
          switch (instrToTgl[0]) {
            case 'inc':
              instrToTgl[0] = 'dec';
              break;
            case 'dec':
            case 'tgl':
              instrToTgl[0] = 'inc';
              break;
            case 'jnz':
              instrToTgl[0] = 'cpy';
              break;
            case 'cpy':
              instrToTgl[0] = 'jnz';
              break;
          }
          instructions[pc + valX] = instrToTgl;
        }
        pc++;
        break;
      }
      default:
        console.error(`Aborted! This instruction is not valid: ${instr}`);
        return regs;
    }
  }
  
  return regs;
}

const src = 'input.txt';

console.log(`Part one: ${execProgram(loadInstrs(src), [7, 0, 0, 0])[0]}`);
console.log(`Part two: ${execProgram(loadInstrs(src), [12, 0, 0, 0])[0]}`);