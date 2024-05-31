const fs = require('fs');

function partOne(document) {
  let count = 0;

  for (let triangle of document) {
    triangle = triangle.trim().split(/\s+/).map(Number);
    triangle.sort((a, b) => a - b);

    if (triangle[0] + triangle[1] > triangle[2]) {
      count += 1;
    }
  }

  return count;
}

function partTwo(document) {
  let count = 0;

  for (let i = 0; i < document.length; i += 3) {
    const column1 = document[i].trim().split(/\s+/).map(Number);
    const column2 = document[i + 1].trim().split(/\s+/).map(Number);
    const column3 = document[i + 2].trim().split(/\s+/).map(Number);

    for (let j = 0; j < 3; ++j) {
      const triangle = [column1[j], column2[j], column3[j]];
      triangle.sort((a, b) => a - b);

      if (triangle[0] + triangle[1] > triangle[2])
        count += 1;
    }
  }

  return count;
}

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('Error reading file: ', err);
    return;
  }

  const document = data.trim().split('\n');

  const possibleTriangles = partOne(document);
  const possibleTriangles2 = partTwo(document);

  console.log('Number of possible triangles: ', possibleTriangles);
  console.log('Number of possible triangles 2: ', possibleTriangles2);
});