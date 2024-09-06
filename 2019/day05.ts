import * as fs from 'fs';

const input = fs.readFileSync('input.txt', 'utf-8').trim();
const program = input.split(',').map(Number);

const getParameterValue = (
  program: number[], parameter: number, mode: number
): number => {
  return mode === 0 ? program[parameter] : parameter;
};

const runIntcodeProgram = (program: number[], input: number): number => {
  let output: number = -1;
  let instructionPointer = 0;

  while (instructionPointer < program.length) {
    const instruction = program[instructionPointer];
    const opcode = instruction % 100;
    const mode1 = Math.floor(instruction / 100) % 10;
    const mode2 = Math.floor(instruction / 1000) % 10;

    const param1 = getParameterValue(
      program, program[instructionPointer + 1], mode1
    );

    if (opcode === 99) {
      break;
    }

    let param2: number | undefined;
    if ([1, 2, 5, 6, 7, 8].includes(opcode)) {
      param2 = getParameterValue(
        program, program[instructionPointer + 2], mode2
      );
    }

    switch (opcode) {
      case 1: {
        const param3 = program[instructionPointer + 3];
        program[param3] = param1 + param2!;
        instructionPointer += 4;
        break;
      }
      case 2: {
        const param3 = program[instructionPointer + 3];
        program[param3] = param1 * param2!;
        instructionPointer += 4;
        break;
      }
      case 3: {
        const param1 = program[instructionPointer + 1];
        program[param1] = input;
        instructionPointer += 2;
        break;
      }
      case 4: {
        output = param1;
        instructionPointer += 2;
        break;
      }
      case 5: {
        instructionPointer = param1 !== 0 ? param2! : instructionPointer + 3;
        break;
      }
      case 6: {
        instructionPointer = param1 === 0 ? param2! : instructionPointer + 3;
        break;
      }
      case 7: {
        const param3 = program[instructionPointer + 3];
        program[param3] = param1 < param2! ? 1 : 0;
        instructionPointer += 4;
        break;
      }
      case 8: {
        const param3 = program[instructionPointer + 3];
        program[param3] = param1 === param2! ? 1 : 0;
        instructionPointer += 4;
        break;
      }
      default: {
        throw new Error(
          `Unknown opcode ${opcode} at position ${instructionPointer}`
        );
      }
    }
  }

  return output;
};

const diagnosticCodePart1 = runIntcodeProgram([...program], 1);
console.log('Diagnostic code:', diagnosticCodePart1);

const diagnosticCodePart2 = runIntcodeProgram([...program], 5);
console.log('Diagnostic code for system ID 5:', diagnosticCodePart2);