import * as fs from 'fs';

const WIDTH = 25;
const HEIGHT = 6;
const LAYER_SIZE = WIDTH * HEIGHT;

function readInputFile(inputFile: string): string {
  return fs.readFileSync(inputFile, 'utf8').trim();
}

function splitIntoLayers(data: string, layerSize: number): string[] {
  const layers: string[] = [];

  for (let i = 0; i < data.length; i += layerSize) {
    layers.push(data.slice(i, i + layerSize));
  }

  return layers;
}

function countDigit(layer: string, digit: string): number {
  return layer.split('').filter(char => char === digit).length;
}

function partOne(layers: string[]): number {
  let minZeroCount = Infinity;
  let result = 0;

  for (const layer of layers) {
    const zeroCount = countDigit(layer, '0');
    if (zeroCount < minZeroCount) {
      minZeroCount = zeroCount;
      const oneCount = countDigit(layer, '1');
      const twoCount = countDigit(layer, '2');
      result = oneCount * twoCount;
    }
  }

  return result;
}

function partTwo(layers: string[]): string {
  const finalImage = new Array(LAYER_SIZE).fill('2');

  for (const layer of layers) {
    for (let i = 0; i < LAYER_SIZE; i++) {
      if (finalImage[i] === '2') {
        finalImage[i] = layer[i]
      }
    }
  }

  let result = '';
  for (let i = 0; i < HEIGHT; i++) {
    result += finalImage.slice(i * WIDTH, (i + 1) * WIDTH).join('') + '\n';
  }

  return result;
}

const inputFile = 'input.txt';
const data = readInputFile(inputFile);
const layers = splitIntoLayers(data, LAYER_SIZE);

const partOneResult = partOne(layers);
console.log(`The number of 1 multiplied by 2: ${partOneResult}`);

const partTwoResult = partTwo(layers);
console.log('Message after decoding the image: ');
console.log(partTwoResult);