const fs = require('fs');

function parseInput(input) {
  return input.map(line => {
    const items = line.match(
      /(\w+ generator|\w+-compatible microchip)/g
    ) || [];
    return items.map(item => {
      const [type, element] = item.split(' ');
      return {
        type: type === 'generator' ? 'G' : 'M',
        element: element.split('-')[0]
      };
    });
  });
}

function makeHash(gens, chips, lift) {
  const g = Array(4)
    .fill(0)
    .map((_, i) => gens.filter(gen => gen === i).length);
  const c = Array(4)
    .fill(0)
    .map((_, i) => chips.filter(chip => chip === i).length);
  return g.join('') + c.join('') + lift;
}

function isInvalid(gens, chips, lift) {
  if (lift < 0 || lift > 3) {
    return true;
  }
  for (let i = 0; i < gens.length; i++) {
    if (chips[i] !== gens[i] && gens.includes(chips[i])) {
      return true;
    }
  }
  return false;
}

function isSolved(positions) {
  return positions.every(pos => pos === 3);
}

function getNewState(positions, lift, steps) {
  const gens = positions.slice(0, positions.length / 2);
  const chips = positions.slice(positions.length / 2);
  return [gens, chips, lift, steps];
}

function calculateSteps(gens, chips, lift, steps) {
  const seen = new Set();
  const queue = [[gens, chips, lift, steps]];

  while (queue.length > 0) {
    const [gens, chips, lift, steps] = queue.shift();
    const hash = makeHash(gens, chips, lift);

    if (seen.has(hash) || isInvalid(gens, chips, lift)) {
      continue;
    }

    seen.add(hash);

    const positions = gens.concat(chips);
    if (isSolved(positions)) {
      return steps;
    }

    for (let i = 0; i < positions.length; i++) {
      if (positions[i] === lift) {
        if (lift < 3) {
          positions[i]++;
          queue.push(getNewState(positions, lift + 1, steps + 1));
          positions[i]--;
        }
        if (lift > 0) {
          positions[i]--;
          queue.push(getNewState(positions, lift - 1, steps + 1));
          positions[i]++;
        }

        for (let j = i + 1; j < positions.length; j++) {
          if (positions[j] === lift) {
            if (lift < 3) {
              positions[i]++;
              positions[j]++;
              queue.push(getNewState(positions, lift + 1, steps + 1));
              positions[i]--;
              positions[j]--;
            }
            if (lift > 0) {
              positions[i]--;
              positions[j]--;
              queue.push(getNewState(positions, lift - 1, steps + 1));
              positions[i]++;
              positions[j]++;
            }
          }
        }
      }
    }
  }

  return -1;
}

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file: ', err);
    return;
  }

  const input = data.trim().split('\n');
  const floors = parseInput(input);

  const gens = [];
  const chips = [];
  floors.forEach((floor, floorIndex) => {
    floor.forEach(item => {
      if (item.type === 'G') {
        gens.push(floorIndex);
      } else {
        chips.push(floorIndex);
      }
    });
  });

  const initialState = {
    gens: gens,
    chips: chips,
    lift: 0,
    steps: 0
  };

  const partOne = calculateSteps(
    initialState.gens,
    initialState.chips,
    initialState.lift,
    initialState.steps
  );

  initialState.gens.push(0, 0);
  initialState.chips.push(0, 0);

  const partTwo = calculateSteps(
    initialState.gens,
    initialState.chips,
    initialState.lift,
    initialState.steps
  );

  console.log('Part One: Minimum number of steps required: ', partOne);
  console.log('Part Two: Minimum number of steps required: ', partTwo);
});