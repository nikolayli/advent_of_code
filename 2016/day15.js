const fs = require('fs');

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

function findFirstCapsuleTime(positions) {
  let time = 0;
  let step = 1;

  for (let i = 0; i < positions.length; i++) {
    let pos = positions[i];

    while ((pos.startPosition + time + i + 1) % pos.positions !== 0) {
      time += step;
    }

    step = lcm(step, pos.positions);
  }

  return time;
}

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file: ', err);
    return;
  }

  const positions = data.trim().split('\n').map(line => {
    const match = line.match(
      /Disc #\d+ has (\d+) positions; at time=0, it is at position (\d+)./
    );
    return {
      positions: parseInt(match[1], 10),
      startPosition: parseInt(match[2], 10)
    };
  });

  const firstCapsulePartOne = findFirstCapsuleTime(positions);
  positions.push({ positions: 11, startPosition: 0 });
  const firstCapsulePartTwo = findFirstCapsuleTime(positions);

  console.log(
    'Part One: First time you can press the button to get a capsule: ',
    firstCapsulePartOne);
  console.log(
    'Part Two: First time you can press the button to get a capsule: ',
    firstCapsulePartTwo);
});