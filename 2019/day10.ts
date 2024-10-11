import * as fs from 'fs';

type Point = { x: number, y: number };

const parseMap = (input: string[]): Point[] => {
  const asteroids: Point[] = [];
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === '#') {
        asteroids.push({ x, y });
      }
    }
  }
  return asteroids;
};

const gcd = (a: number, b: number): number => {
  if (b === 0) return a;
  return gcd(b, a % b);
};

const getAngle = (origin: Point, target: Point): number => {
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;
  let angle = Math.atan2(dy, dx);
  if (angle < -Math.PI / 2) {
    angle += 2 * Math.PI;
  }
  return angle;
};

const getVisibleAsteroids = (
  origin: Point,
  asteroids: Point[]
): Set<string> => {
  const angles = new Set<string>();
  for (const asteroid of asteroids) {
    if (asteroid.x === origin.x && asteroid.y === origin.y) continue;
    const dx = asteroid.x - origin.x;
    const dy = asteroid.y - origin.y;
    const divisor = gcd(Math.abs(dx), Math.abs(dy));
    angles.add(`${dx / divisor},${dy / divisor}`);
  }
  return angles;
};

const findBestLocation = (
  asteroids: Point[]
): { location: Point, count: number } => {
  let maxVisible = 0;
  let bestLocation: Point = { x: 0, y: 0 };
  for (const asteroid of asteroids) {
    const visible = getVisibleAsteroids(asteroid, asteroids).size;
    if (visible > maxVisible) {
      maxVisible = visible;
      bestLocation = asteroid;
    }
  }
  return { location: bestLocation, count: maxVisible };
};

const vaporizeAsteroids = (
  station: Point,
  asteroids: Point[]
): Point[] => {
  const asteroidsByAngle: Map<number, Point[]> = new Map();
  for (const asteroid of asteroids) {
    if (asteroid.x === station.x && asteroid.y === station.y) continue;
    const angle = getAngle(station, asteroid);
    if (!asteroidsByAngle.has(angle)) {
      asteroidsByAngle.set(angle, []);
    }
    asteroidsByAngle.get(angle)!.push(asteroid);
  }

  for (const [angle, points] of asteroidsByAngle) {
    points.sort((a, b) => {
      const distA = Math.hypot(a.x - station.x, a.y - station.y);
      const distB = Math.hypot(b.x - station.x, b.y - station.y);
      return distA - distB;
    });
  }

  const sortedAngles = Array.from(asteroidsByAngle.keys()).sort(
    (a, b) => a - b
  );
  const vaporized: Point[] = [];
  while (vaporized.length < asteroids.length - 1) {
    for (const angle of sortedAngles) {
      const points = asteroidsByAngle.get(angle);
      if (points && points.length > 0) {
        vaporized.push(points.shift()!);
      }
    }
  }
  return vaporized;
};

const input = fs.readFileSync('input.txt', 'utf-8').trim().split('\n');

const asteroids = parseMap(input);
const { location, count } = findBestLocation(asteroids);
console.log(
  `Best location: (${location.x}, ${location.y}) with ${count} asteroids ` +
  `detected`
);

const vaporizedAsteroids = vaporizeAsteroids(location, asteroids);
const asteroid200 = vaporizedAsteroids[199];
console.log(
  `200th asteroid to be vaporized: (${asteroid200.x}, ${asteroid200.y}) ` +
  `Result: ${asteroid200.x * 100 + asteroid200.y}`
);