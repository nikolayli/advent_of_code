import * as fs from 'fs';

type Vec = {
  dir: string;
  dist: number;
};

type Coord = {
  x: number;
  y: number;
};

function parseInput(input: string): Vec[][] {
  return input
    .trim()
    .split('\n')
    .map(line =>
      line.trim().split(',').map(move => {
        const [dir, dist] = [move[0], move.slice(1)];
        return { dir, dist: parseInt(dist) };
      })
    );
}

function toPath(vecPath: Vec[]): Coord[] {
  const path: Coord[] = [{ x: 0, y: 0 }];
  let cur = { x: 0, y: 0 };
  for (const { dir, dist } of vecPath) {
    let dim: keyof Coord;
    let d: number;
    switch (dir) {
      case 'U': dim = 'y'; d = -1; break;
      case 'D': dim = 'y'; d = 1; break;
      case 'L': dim = 'x'; d = -1; break;
      case 'R': dim = 'x'; d = 1; break;
      default: throw new Error(`Invalid direction: ${dir}`);
    }
    for (let n = 0; n < dist; n++) {
      cur = { ...cur, [dim]: cur[dim] + d };
      path.push(cur);
    }
  }
  return path;
}

function findIntersects(coords1: Coord[], coords2: Coord[]): Coord[] {
  const coords = new Set(coords1.map(c => `${c.x},${c.y}`));
  const intersections: Coord[] = [];
  for (const c of coords2) {
    if (coords.has(`${c.x},${c.y}`)) {
      intersections.push(c);
    }
  }
  return intersections;
}

function dist(c: Coord): number {
  return Math.abs(c.x) + Math.abs(c.y);
}

function partOne(intersects: Coord[]): number {
  let closestDist = 0;
  for (const coord of intersects) {
    const d = dist(coord);
    if (closestDist === 0 || d < closestDist) {
      closestDist = d;
    }
  }
  return closestDist;
}

function stepsTo(to: Coord, path: Coord[]): number {
  for (let i = 0; i < path.length; i++) {
    if (path[i].x === to.x && path[i].y === to.y) {
      return i;
    }
  }
  return -1;
}

function partTwo(coords: Coord[], path1: Coord[], path2: Coord[]): number {
  let speed = 0;
  for (const c of coords) {
    const sum = stepsTo(c, path1) + stepsTo(c, path2);
    if (speed === 0 || sum < speed) {
      speed = sum;
    }
  }
  return speed;
}

const input = fs.readFileSync('input.txt', 'utf-8');
const wireMovements = parseInput(input);
const path1 = toPath(wireMovements[0]);
const path2 = toPath(wireMovements[1]);
const intersects = findIntersects(path1, path2);

const closest = partOne(intersects);
const fastest = partTwo(intersects, path1, path2);

console.log(`Closest intersection distance: ${closest}`);
console.log(`Fastest intersection steps: ${fastest}`);