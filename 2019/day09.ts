import * as fs from 'fs';

class IncodeComputer {
  private memory: Map<number, bigint>;
  private pointer: number;
  private relativeBase: number;
  private input: bigint[];
  private output: bigint[];

  constructor(program: string, input: bigint[]) {
    this.memory = new Map();
    this.pointer = 0;
    this.relativeBase = 0;
    this.input = input;
    this.output = [];

    const initialMemory = program.split(',').map(BigInt);
    initialMemory.forEach((value, index) => {
      this.memory.set(index, value);
    });
  }

  private getParameter(mode: number, offset: number): bigint {
    const param = this.memory.get(this.pointer + offset) || 0n;
    switch (mode) {
      case 0:
        return this.memory.get(Number(param)) || 0n;
      case 1:
        return param;
      case 2:
        return this.memory.get(Number(param) + this.relativeBase) || 0n;
      default:
        throw new Error(`Unknown parameter mode: ${mode}`);      
    }
  }

  private setParameter(mode: number, offset: number, value: bigint): void {
    const param = this.memory.get(this.pointer + offset) || 0n;
    switch (mode) {
      case 0:
        this.memory.set(Number(param), value);
        break;
      case 2:
        this.memory.set(Number(param) + this.relativeBase, value);
        break;
      default:
        throw new Error(`Unknown parameter mode: ${mode}`);  
    }
  }

  public run(): bigint[] {
    while (true) {
      const instruction = this.memory.get(this.pointer) || 0n;
      const opcode = Number(instruction % 100n);
      const modes = [
        Number((instruction / 100n) % 10n),
        Number((instruction / 1000n) % 10n),
        Number((instruction / 10000n) % 10n)
      ];

      switch (opcode) {
        case 1: {
          const param1 = this.getParameter(modes[0], 1);
          const param2 = this.getParameter(modes[1], 2);
          this.setParameter(modes[2], 3, param1 + param2);
          this.pointer += 4;
          break;
        }
        case 2: {
          const param1 = this.getParameter(modes[0], 1);
          const param2 = this.getParameter(modes[1], 2);
          this.setParameter(modes[2], 3, param1 * param2);
          this.pointer += 4;
          break;
        }
        case 3: {
          if (this.input.length === 0) {
            throw new Error('No input available')
          }
          this.setParameter(modes[0], 1, this.input.shift()!);
          this.pointer += 2;
          break;
        }
        case 4: {
          const param1 = this.getParameter(modes[0], 1);
          this.output.push(param1);
          this.pointer += 2;
          break;
        }
        case 5: {
          const param1 = this.getParameter(modes[0], 1);
          const param2 = this.getParameter(modes[1], 2);
          if (param1 !== 0n) {
            this.pointer = Number(param2)
          } else {
            this.pointer += 3;
          }
          break;
        }
        case 6: {
          const param1 = this.getParameter(modes[0], 1);
          const param2 = this.getParameter(modes[1], 2);
          if (param1 === 0n) {
            this.pointer = Number(param2)
          } else {
            this.pointer += 3;
          }
          break;
        }
        case 7: {
          const param1 = this.getParameter(modes[0], 1);
          const param2 = this.getParameter(modes[1], 2);
          this.setParameter(modes[2], 3, param1 < param2 ? 1n : 0n);
          this.pointer += 4;
          break;
        }
        case 8: {
          const param1 = this.getParameter(modes[0], 1);
          const param2 = this.getParameter(modes[1], 2);
          this.setParameter(modes[2], 3, param1 === param2 ? 1n : 0n);
          this.pointer += 4;
          break;
        }
        case 9: {
          const param1 = this.getParameter(modes[0], 1);
          this.relativeBase += Number(param1);
          this.pointer += 2;
          break;
        }
        case 99:
          return this.output;
        default:
          throw new Error(`Unknown opcode: ${opcode}`);
      }
    }
  }
}

const program = fs.readFileSync('input.txt', 'utf-8').trim();

const computer1 = new IncodeComputer(program, [1n]);
const output1 = computer1.run();
console.log('BOOST keycode:', Number(output1));

const computer2 = new IncodeComputer(program, [2n]);
const output2 = computer2.run();
console.log('Distress signal coordinates:', Number(output2));