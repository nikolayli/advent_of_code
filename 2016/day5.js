const crypto = require('crypto');

function partOne(doorId) {
  let password = '';
  let index = 0;

  while (password.length < 8) {
    const inputString = doorId + index;

    const hashValue = crypto.createHash('md5').update(inputString).digest('hex');

    if (hashValue.startsWith('00000'))
      password += hashValue[5];

    ++index;
  }

  return password;
}

function partTwo(doorId) {
  let password = Array(8).fill('_');
  let index = 0;

  while (password.includes('_')) {
    const inputString = doorId + index;

    const hashValue = crypto.createHash('md5').update(inputString).digest('hex');
    
    if (hashValue.startsWith('00000')) {
      const position = parseInt(hashValue[5], 10);
      const character = hashValue[6];

      if (position >= 0 && position < 8 && password[position] === '_')
        password[position] = character;
    }

    ++index;
  }

  return password.join('');
}

const doorId = 'reyedfim';

const password = partOne(doorId);
const password2 = partTwo(doorId);

console.log('First door password: ', password);
console.log('Password for the second door' , password2);