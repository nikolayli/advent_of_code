import * as fs from 'fs';

type Directions = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT';
type Color = 0 | 1;
type Turn = 0 | 1;

interface Position {
  x: number;
  y: number;
}

class IntcodeComputer {
  private memory: number[];
  private pointer: number = 0;
  private relativeBase: number = 0;
  private input: number[] = [];
  private output: number[] = [];

  constructor(program: number[]) {
    this.memory = [...program];
  }

  private getParameter(mode: number, offset: number): number {
    const position = this.pointer + offset;
    switch (mode) {
      case 0:
        return this.memory[this.memory[position]] || 0;
      case 1:
        return this.memory[position] || 0;
      case 2:
        return this.memory[this.relativeBase + 
              (this.memory[position] || 0)] || 0;
      default:
        throw new Error(`Unknown parameter mode: ${mode}`);
    }
  }

  private setParameter(mode: number, offset: number, value: number): void {
    const position = this.pointer + offset;
    switch (mode) {
      case 0:
        this.memory[this.memory[position]] = value;
        break;
      case 2:
        this.memory[this.relativeBase + (this.memory[position] || 0)] = value;
        break;
      default:
        throw new Error(`Unknown parameter mode: ${mode}`);
    }
  }

  public run(input: number[]): number[] {
    this.input = input;
    this.output = [];
    while (this.memory[this.pointer] !== 99) {
      const instruction = this.memory[this.pointer];
      const opcode = instruction % 100;
      const modes = [
        Math.floor(instruction / 100) % 10,
        Math.floor(instruction / 1000) % 10,
        Math.floor(instruction / 10000) % 10,
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
          if (this.input.length === 0) return this.output;
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
          if (param1 !== 0) this.pointer = param2;
          else this.pointer += 3;
          break;
        }
        case 6: {
          const param1 = this.getParameter(modes[0], 1);
          const param2 = this.getParameter(modes[1], 2);
          if (param1 === 0) this.pointer = param2;
          else this.pointer += 3;
          break;
        }
        case 7: {
          const param1 = this.getParameter(modes[0], 1);
          const param2 = this.getParameter(modes[1], 2);
          this.setParameter(modes[2], 3, param1 < param2 ? 1 : 0);
          this.pointer += 4;
          break;
        }
        case 8: {
          const param1 = this.getParameter(modes[0], 1);
          const param2 = this.getParameter(modes[1], 2);
          this.setParameter(modes[2], 3, param1 === param2 ? 1 : 0);
          this.pointer += 4;
          break;
        }
        case 9: {
          const param1 = this.getParameter(modes[0], 1);
          this.relativeBase += param1;
          this.pointer += 2;
          break;
        }
        default:
          throw new Error(`Unknown opcode: ${opcode}`);
      }
    }

    return this.output;
  }
}

class HullPaintingRobot {
  private position: Position = { x: 0, y: 0 };
  private direction: Directions = 'UP';
  private panels: Map<string, Color> = new Map();
  private paintedPanels: Set<string> = new Set();

  constructor(private computer: IntcodeComputer) {}

  private getPanelKey(position: Position): string {
    return `${position.x},${position.y}`;
  }

  private turnAndMove(turn: Turn): void {
    const directions: Directions[] = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
    const currentIndex = directions.indexOf(this.direction);
    const newIndex = (currentIndex + (turn === 0 ? -1 : 1) + 4) % 4;
    this.direction = directions[newIndex];

    switch (this.direction) {
      case 'UP':
        this.position.y -= 1;
        break;
      case 'RIGHT':
        this.position.x += 1;
        break;
      case 'DOWN':
        this.position.y += 1;
        break;
      case 'LEFT':
        this.position.x -= 1;
        break;
    }
  }

  public run(initialPanelColor: Color): void {
    this.panels.set(this.getPanelKey(this.position), initialPanelColor);

    while (true) {
      const currentPanelColor = 
        this.panels.get(this.getPanelKey(this.position)) || 0;
      const output = this.computer.run([currentPanelColor]);

      if (output.length < 2) break;

      const [newColor, turn] = output as [Color, Turn];
      this.panels.set(this.getPanelKey(this.position), newColor);
      this.paintedPanels.add(this.getPanelKey(this.position));
      this.turnAndMove(turn);
    }
  }

  public getPaintedPanelsCount(): number {
    return this.paintedPanels.size;
  }

  public printRegistrationIdentifier(): void {
    const paintedPositions = Array.from(this.panels.entries())
      .filter(([, color]) => color === 1)
      .map(([key]) => key.split(',').map(Number));

    const minX = Math.min(...paintedPositions.map(([x]) => x));
    const maxX = Math.max(...paintedPositions.map(([x]) => x));
    const minY = Math.min(...paintedPositions.map(([, y]) => y));
    const maxY = Math.max(...paintedPositions.map(([, y]) => y));

    const grid: string[][] = Array.from({ length: maxY - minY + 1 }, () =>
      Array(maxX - minX + 1).fill('.')
    );

    for (const [x, y] of paintedPositions) {
      grid[y - minY][x - minX] = '#';
    }

    console.log(grid.map((row) => row.join('')).join('\n'));
  }
}

const input = fs.readFileSync('input.txt', 'utf-8').trim();
const program = input.split(',').map(Number);

const computer1 = new IntcodeComputer(program);
const robot1 = new HullPaintingRobot(computer1);
robot1.run(0);
console.log(
  `Number of panels that the robot will paint at least once: ${robot1.getPaintedPanelsCount()}`
);

const computer2 = new IntcodeComputer(program);
const robot2 = new HullPaintingRobot(computer2);
robot2.run(1);
console.log('Registration identifier:');
robot2.printRegistrationIdentifier();