import * as fs from 'fs';

const readInput = (): string => {
  return fs.readFileSync('input.txt', 'utf-8');
};

const parseInput = (input: string): number[] => {
  return input.split('\n')
              .filter(line => line.trim() !== '')
              .map(line => parseInt(line, 10));  
}

const calculateFuel = (mass: number): number => {
  return Math.floor(mass / 3) - 2;
};

const calculateTotalFluelForMass = (mass: number) : number => {
  let totalFlue = 0;
  let additionalFuel = calculateFuel(mass);

  while (additionalFuel > 0) {
    totalFlue += additionalFuel;
    additionalFuel = calculateFuel(additionalFuel);
  }

  return totalFlue;
};

const partOne = (masses: number[]) : number => {
  return masses.reduce((acc, mass) => acc + calculateFuel(mass), 0);
};

const partTwo = (masses: number[]): number => {
  return masses.reduce((acc, mass) => acc + calculateTotalFluelForMass(mass), 0);
}

const input = readInput();
const masses = parseInput(input);

const totalFuel = partOne(masses);
const totalFuelAndAdd = partTwo(masses);

console.log(`Amount of fuel for all spacecraft modules: ${totalFuel}`);
console.log(`Amount of fuel for all modules of the spacecraft, taking into account the added fuel: ${totalFuelAndAdd}`);