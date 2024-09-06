import * as fs from 'fs';

class SpaceObject {
  id: string;
  orbits: SpaceObject | null = null;

  constructor(id: string) {
    this.id = id;
  }
}

const spaceObjects: SpaceObject[] = [];

function readInputFile(fileName: string): string[] {
  const text: string = fs.readFileSync(fileName, 'utf8');
  return text.trim().split('\n');
}

function getSpaceObject(id: string, orbits: string | null): SpaceObject {
  let spaceObject = spaceObjects.find(so => so.id === id);
  if (!spaceObject) {
    spaceObject = new SpaceObject(id);
    spaceObjects.push(spaceObject);
  }

  if (orbits) {
    spaceObject.orbits = getSpaceObject(orbits, null);
  }

  return spaceObject;
}

function buildMap() {
  const orbits = readInputFile('input.txt');
  for (const orbit of orbits) {
    const [centerId, orbiterId] = orbit.split(')');
    getSpaceObject(orbiterId, centerId);
  }
}

function partOne(): number {
  let orbitCount = 0;
  for (const spaceObject of spaceObjects) {
    let current: SpaceObject | null = spaceObject;
    while (current.orbits) {
      orbitCount++;
      current = current.orbits;
    }
  }
  return orbitCount;
}

function partTwo(startId: string, endId: string): number {
  const startPath = getPathToCOM(startId);
  const endPath = getPathToCOM(endId);
  let commonAncestorIndex = 0;

  while (startPath[commonAncestorIndex] === endPath[commonAncestorIndex]) {
    commonAncestorIndex++;
  }

  return (startPath.length - commonAncestorIndex) +
         (endPath.length - commonAncestorIndex);
}

function getPathToCOM(id: string): string[] {
  const path: string[] = [];
  let current = spaceObjects.find(so => so.id === id)?.orbits;

  while (current) {
    path.push(current.id);
    current = current.orbits;
  }

  return path.reverse();
}

buildMap();
console.log(`Total number of direct and indirect orbits: ${partOne()}`);
console.log(
  `Minimum number of orbital transfers required: ${partTwo('YOU', 'SAN')}`
);