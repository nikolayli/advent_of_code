const fs = require('fs');

const WALL = '#';
const POI = /\d/;

function parseGrid(input) {
  const points = {};
  const grid = input.split('\n').map((line, y) =>
    line.split('').map((char, x) => {
      const val = char === WALL ? 1 : 0;
      if (POI.test(char)) points[char] = { x, y };
      return val;
    })
  );

  return { grid, points };
}

function* permute(items) {
  if (items.length <= 1) {
    yield items;
    return;
  }
  for (let i = 0; i < items.length; i++) {
    const subItems = items.slice();
    const item = subItems.splice(i, 1)[0];
    for (const combo of permute(subItems)) {
      yield [item, ...combo];
    }
  }
}

function bfs(start, end, grid) {
  const directions = [
    { dx:  0, dy:  1 },
    { dx:  1, dy:  0 },
    { dx:  0, dy: -1 },
    { dx: -1, dy:  0 }
  ];
  const queue = [{ ...start, steps: 0 }];
  const visited = new Set();
  visited.add(`${start.x},${start.y}`);

  while (queue.length > 0) {
    const { x, y, steps } = queue.shift();
    if (x === end.x && y === end.y) return steps;

    for (const { dx, dy } of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (
        nx >= 0 &&
        ny >= 0 &&
        nx < grid[0].length &&
        ny < grid.length &&
        grid[ny][nx] !== 1 &&
        !visited.has(`${nx},${ny}`)
      ) {
        queue.push({ x: nx, y: ny, steps: steps + 1 });
        visited.add(`${nx},${ny}`);
      }
    }
  }

  return Infinity;
}

function precomputeDistances(points, grid) {
  const keys = Object.keys(points);
  const distances = {};

  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const key1 = keys[i];
      const key2 = keys[j];
      const dist = bfs(points[key1], points[key2], grid);
      distances[`${key1},${key2}`] = dist;
      distances[`${key2},${key1}`] = dist;
    }
  }

  return distances;
}

function pathThroughPoints(points, distances) {
  let totalSteps = 0;
  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1];
    const point = points[i];
    totalSteps += distances[`${prevPoint},${point}`];
  }

  return totalSteps;
}

function partOne(input) {
  const { grid, points } = parseGrid(input);
  const otherPoints = Object.keys(points).filter(key => key !== '0');
  const distances = precomputeDistances(points, grid);
  let minSteps = Infinity;

  for (const perm of permute(otherPoints)) {
    const combo = ['0', ...perm];
    const steps = pathThroughPoints(combo, distances);
    if (steps < minSteps) minSteps = steps;
  }

  return minSteps;
}

function partTwo(input) {
  const { grid, points } = parseGrid(input);
  const otherPoints = Object.keys(points).filter(key => key !== '0');
  const distances = precomputeDistances(points, grid);
  let minSteps = Infinity;

  for (const perm of permute(otherPoints)) {
    const combo = ['0', ...perm, '0'];
    const steps = pathThroughPoints(combo, distances);
    if (steps < minSteps) minSteps = steps;
  }

  return minSteps;
}

const input = fs.readFileSync('input.txt', 'utf-8').trim();

const fewestNumberOfSteps = partOne(input);
const visitEveryNonZeroSteps = partTwo(input);

console.log(`The fewest number of steps required to visit every non-0 number marked on the map at least once is: ${fewestNumberOfSteps}`);
console.log(`The fewest number of steps required to start at 0, visit every non-0 number marked on the map at least once, and then return to 0 is: ${visitEveryNonZeroSteps}`);