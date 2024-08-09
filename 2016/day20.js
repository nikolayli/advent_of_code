const fs = require('fs');

function parseInput(file) {
  const input = fs.readFileSync(file, 'utf-8');
  return input.trim().split('\n').map(line => {
    const [start, end] = line.split('-').map(Number);
    return { start, end };
  });
}

function mergeRanges(ranges) {
  ranges.sort((a, b) => a.start - b.start);
  const mergedRanges = [];
  let currentRange = ranges[0];

  for (let i = 1; i < ranges.length; i++) {
    const range = ranges[i];
    if (range.start <= currentRange.end + 1) {
      currentRange.end = Math.max(currentRange.end, range.end);
    } else {
      mergedRanges.push(currentRange);
      currentRange = range;
    }
  }
  mergedRanges.push(currentRange);
  return mergedRanges;
}

function partOne(mergedRanges) {
  let lowestUnblockedIP = 0;
  for (const range of mergedRanges) {
    if (lowestUnblockedIP < range.start) {
      break;
    }
    lowestUnblockedIP = range.end + 1;
  }

  return lowestUnblockedIP;
}

function partTwo(mergedRanges) {
  const MAX_IP = 4294967295;
  let allowedIPsCount = 0;
  let currentIP = 0;

  for (const range of mergedRanges) {
    if (currentIP < range.start) {
      allowedIPsCount += range.start - currentIP;
    }
    currentIP = Math.max(currentIP, range.end + 1);
  }

  if (currentIP <= MAX_IP) {
    allowedIPsCount += MAX_IP - currentIP + 1;
  }

  return allowedIPsCount;
}

const ranges = parseInput('input.txt');
const mergedRanges = mergeRanges(ranges);

const lowestIPNotBlocked = partOne(mergedRanges);
const numberOfAllowedIP = partTwo(mergedRanges);

console.log(
  `Part One: The lowest-valued IP that is not blocked is: ${
    lowestIPNotBlocked
  }`
);
console.log(
  `Part Two: The number of allowed IPs is: ${numberOfAllowedIP}`
);