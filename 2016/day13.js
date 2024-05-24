function isWall(x, y, favoriteNumber) {
  let sum = x*x + 3*x + 2*x*y + y + y*y;
  sum += favoriteNumber;
  const binary = sum.toString(2);
  const bits = binary.split('').filter(bit => bit === '1').length;

  return bits % 2 !== 0;
}

function exploreMaze(favoriteNumber, callback) {
  const queue = [{ x: 1, y: 1, steps: 0}];
  const visited = new Set(['1,1']);

  while (queue.length > 0) {
    const { x, y, steps } = queue.shift();

    if (callback(x, y, steps, visited)) {
      return { steps, visited };
    }

    const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;

      if (newX >= 0 && newY >= 0 && !isWall(newX, newY, favoriteNumber)) {
        const coord = `${newX},${newY}`;
        if (!visited.has(coord)) {
          visited.add(coord);
          queue.push({ x: newX, y: newY, steps: steps + 1 });
        }
      }
    }
  }

  return { visited };
}

function partOne(favoriteNumber, targetX, targetY) {
  const result = exploreMaze(favoriteNumber, (x, y, steps) => x === targetX && y === targetY);
  return result.steps;
}

function partTwo(favoriteNumber, maxSteps) {
  const result = exploreMaze(favoriteNumber, (x, y, steps) => steps >= maxSteps);
  return result.visited.size;
}

const favoriteNumber = 1350;
const targetX = 31;
const targetY = 39;
const maxSteps = 50;

const numberOfSteps = partOne(favoriteNumber, targetX, targetY);
const locations = partTwo(favoriteNumber, maxSteps);

console.log("Fewest number of steps required to reach the target:", numberOfSteps);
console.log("Number of distinct locations reachable in at most 50 steps:", locations);