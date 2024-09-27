import * as fs from 'fs';

const readInput = (filePath: string): number[] => {
  const data = fs.readFileSync(filePath, 'utf8');
  return data.trim().split(',').map(Number);
};

class IntcodeComputer {
  private memory: number[];
  private pointer: number;
  private inputs: number[];
  private outputs: number[];
  private halted: boolean;

  constructor(program: number[]) {
    this.memory = [...program];
    this.pointer = 0;
    this.inputs = [];
    this.outputs = [];
    this.halted = false;
  }

  public addInput(input: number): void {
    this.inputs.push(input);
  }

  public getOutput(): number | undefined {
    return this.outputs.shift();
  }

  public isHalted(): boolean {
    return this.halted;
  }

  public run(): void {
    while (this.memory[this.pointer] !== 99) {
      const instruction = this.memory[this.pointer];
      const opcode = instruction % 100;
      const modes = Math.floor(instruction / 100)
        .toString()
        .padStart(3, '0')
        .split('')
        .reverse()
        .map(Number);

      const getParam = (index: number): number => {
        const mode = modes[index - 1];
        const value = this.memory[this.pointer + index];
        return mode === 0 ? this.memory[value] : value;
      };

      switch (opcode) {
        case 1:
          this.memory[this.memory[this.pointer + 3]] =
            getParam(1) + getParam(2);
          this.pointer += 4;
          break;
        case 2:
          this.memory[this.memory[this.pointer + 3]] =
            getParam(1) * getParam(2);
          this.pointer += 4;
          break;
        case 3:
          if (this.inputs.length === 0) return;
          this.memory[this.memory[this.pointer + 1]] = this.inputs.shift()!;
          this.pointer += 2;
          break;
        case 4:
          this.outputs.push(getParam(1));
          this.pointer += 2;
          break;
        case 5:
          this.pointer = getParam(1) !== 0 ? getParam(2) : this.pointer + 3;
          break;
        case 6:
          this.pointer = getParam(1) === 0 ? getParam(2) : this.pointer + 3;
          break;
        case 7:
          this.memory[this.memory[this.pointer + 3]] =
            getParam(1) < getParam(2) ? 1 : 0;
          this.pointer += 4;
          break;
        case 8:
          this.memory[this.memory[this.pointer + 3]] =
            getParam(1) === getParam(2) ? 1 : 0;
          this.pointer += 4;
          break;
        default:
          throw new Error(
            `Unknown opcode ${opcode} at position ${this.pointer}`
          );
      }
    }
    this.halted = true;
  }
}

const permute = (arr: number[]): number[][] => {
  if (arr.length === 0) return [[]];
  return arr.flatMap((v, i) =>
    permute([...arr.slice(0, i), ...arr.slice(i + 1)]).map(p => [v, ...p])
  );
};

const runAmplifiersSeries = (
  program: number[],
  phaseSettings: number[]
): number => {
  let inputSignal = 0;
  for (const phase of phaseSettings) {
    const computer = new IntcodeComputer(program);
    computer.addInput(phase);
    computer.addInput(inputSignal);
    computer.run();
    inputSignal = computer.getOutput()!;
  }

  return inputSignal;
};

const runAmplifiersFeedbackLoop = (
  program: number[],
  phaseSettings: number[]
): number => {
  const computers = phaseSettings.map(phase => {
    const computer = new IntcodeComputer(program);
    computer.addInput(phase);
    return computer;
  });

  let inputSignal = 0;
  let lastOutput = 0;

  while (!computers[4].isHalted()) {
    for (const computer of computers) {
      computer.addInput(inputSignal);
      computer.run();
      inputSignal = computer.getOutput()!;
    }
    lastOutput = inputSignal;
  }

  return lastOutput;
};

const program = readInput('input.txt');

const phaseSettingsPart1 = [0, 1, 2, 3, 4];
const maxSignalPart1 = Math.max(
  ...permute(phaseSettingsPart1).map(settings =>
    runAmplifiersSeries(program, settings)
  )
);
console.log(
  `Maximum signal that can be sent to the thrusters: ${maxSignalPart1}`
);

const phaseSettingsPart2 = [5, 6, 7, 8, 9];
const maxSignalPart2 = Math.max(
  ...permute(phaseSettingsPart2).map(settings =>
    runAmplifiersFeedbackLoop(program, settings)
  )
);
console.log(
  `Maximum signal with feedback circuits that can be sent to the thrusters: ${maxSignalPart2}`
);