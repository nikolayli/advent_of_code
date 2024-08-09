const numElves = 3005290;

function partOne(numElves) {
  let highestPowerOf2 = 1;
  while (highestPowerOf2 * 2 <= numElves) {
    highestPowerOf2 *= 2;
  }

  return 1 + (numElves - highestPowerOf2) * 2;
}

function partTwo(numElves) {
  let power = Math.floor(Math.log(numElves) / Math.log(3));
  let largestPowerOf3 = Math.pow(3, power);

  if (numElves === largestPowerOf3) {
    return numElves;
  } else if (numElves <= 2 * largestPowerOf3) {
    return numElves - largestPowerOf3;
  } else {
    return 2 * numElves - 3 * largestPowerOf3;
  }
}

const partOneResult = partOne(numElves);
const partTwoResult = partTwo(numElves);

console.log(`Part One: The Elf that gets all the presents is Elf number ${partOneResult}`);
console.log(`Part Two: The Elf that gets all the presents is Elf number ${partTwoResult}`);