import * as fs from 'fs';

function readInputFile(): number[] {
  const input = fs.readFileSync('input.txt', 'utf-8');
  return input.trim().split(',').map(Number);
}

function runIntcodeProgram(program: number[]): number[] {
  const memory = [...program];
  let pointer = 0;

  while (pointer < memory.length) {
    const opcode = memory[pointer];

    if (opcode === 99) {
      break;
    }

    const param1 = memory[pointer + 1];
    const param2 = memory[pointer + 2];
    const param3 = memory[pointer + 3];

    if (opcode === 1) {
      memory[param3] = memory[param1] + memory[param2];
    } else if (opcode === 2) {
      memory[param3] = memory[param1] * memory[param2];
    } else {
      throw new Error(`Unknown opcode ${opcode} encountered at position ${pointer}`);
    }
    pointer += 4;
  }

  return memory;
}

function partOne(program: number[]) : number {
  program[1] = 12;
  program[2] = 2;
  const finalState = runIntcodeProgram(program);

  return finalState[0];
}

function partTwo(program: number[], targetOutput: number) : number {
  for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb++) {
      const memory = [...program];
      memory[1] = noun;
      memory[2] = verb;

      const finalState = runIntcodeProgram(memory);

      if (finalState[0] === targetOutput) {
        return 100 * noun + verb;
      }
    }
  }

  throw new Error('No valid noun and verb found to produce the target output');
}

const program = readInputFile()
const targetOutput = 19690720;

const partOneResult = partOne(program);
console.log(`The value at position 0 after the program halts is: ${partOneResult}`);

const partTwoResult = partTwo(program, targetOutput);
console.log(`The noun and verb that produce the output ${targetOutput} result in: ${partTwoResult}`);