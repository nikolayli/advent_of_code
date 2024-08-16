const fs = require('fs');

function parseInput(file) {
  const input = fs.readFileSync(file, 'utf-8');
  return input.trim().split('\n').slice(2).map(line => {
    const parts = line.split(/\s+/);
    const [x, y] = parts[0].match(/x(\d+)-y(\d+)/).slice(1, 3).map(Number);
    const size = parseInt(parts[1].replace('T', ''), 10);
    const used = parseInt(parts[2].replace('T', ''), 10);
    const avail = parseInt(parts[3].replace('T', ''), 10);
    return { x, y, size, used, avail };
  });
}

function partOne(nodes) {
  let viablePairs = 0;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
      if (i !== j && nodes[i].used > 0 && nodes[i].used <= nodes[j].avail) {
        viablePairs++;
      }
    }
  }

  return viablePairs;
}

function createGrid(nodes) {
  const width = Math.max(...nodes.map(node => node.x)) + 1;
  const height = Math.max(...nodes.map(node => node.y)) + 1;

  const grid = Array.from({ length: height }, () => Array(width).fill('.'));
  let emptyNode = null;
  let goalNode = null;

  nodes.forEach(node => {
    if (node.used === 0) {
      grid[node.y][node.x] = '_';
      emptyNode = node;
    } else if (node.x === width - 1 && node.y === 0) {
      grid[node.y][node.x] = 'G';
      goalNode = node;
    } else if (node.used > 100) {
      grid[node.y][node.x] = '#';
    }
  });

  grid[0][0] = 'S';

  return { grid, emptyNode, goalNode, width, height };
}

function bfs(start, goal, grid, width, height) {
  const queue = [[start, 0]];
  const visited = new Set();
  visited.add(`${start.x},${start.y}`);

  const directions = [
    { x:  0, y: -1 },
    { x:  0, y:  1 },
    { x: -1, y:  0 },
    { x:  1, y:  0 }
  ];

  while (queue.length > 0) {
    const [{ x, y }, steps] = queue.shift();

    if (x === goal.x && y === goal.y) {
      return steps;
    }

    for (const { x: dx, y: dy } of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < width && ny >= 0 && ny < height &&
          !visited.has(`${nx},${ny}`) && grid[ny][nx] !== '#') {
        visited.add(`${nx},${ny}`);
        queue.push([{ x: nx, y: ny }, steps + 1]);
      }
    }
  }

  return -1;
}

function partTwo(gridInfo) {
  const { grid, emptyNode, goalNode, width, height } = gridInfo;

  const stepsToMoveEmptyToGoal = 
    bfs(emptyNode, { x: goalNode.x - 1, y: goalNode.y }, grid, width, height);
  const stepsToMoveGoalToStart = (width - 2) * 5 + 1;

  return stepsToMoveEmptyToGoal + stepsToMoveGoalToStart;
}

const nodes = parseInput('input.txt');
const gridInfo = createGrid(nodes);

const viablePairs = partOne(nodes);
const totalSteps = partTwo(gridInfo);

console.log(`Number of viable pairs: ${viablePairs}`);
console.log(`Fewest number of steps required: ${totalSteps}`);