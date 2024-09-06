const hasTwoAdjacentDigits = (num: number): boolean => {
  const numStr = num.toString();
  for (let i = 0; i < numStr.length - 1; i++) {
    if (numStr[i] === numStr[i + 1]) {
      return true;
    }
  }
  return false;
};

const digitsNeverDecrease = (num: number): boolean => {
  const numStr = num.toString();
  for (let i = 0; i < numStr.length - 1; i++) {
    if (numStr[i] > numStr[i + 1]) {
      return false;
    }
  }
  return true;
};

const hasExactTwoAdjacentDigits = (num: number): boolean => {
  const numStr = num.toString();
  const digitCount: { [key: string]: number } = {};
  for (const digit of numStr) {
    digitCount[digit] = (digitCount[digit] || 0) + 1;
  }
  return Object.values(digitCount).includes(2);
};

const isValidPasswordPartOne = (num: number): boolean => {
  return hasTwoAdjacentDigits(num) && digitsNeverDecrease(num);
};

const isValidPasswordPartTwo = (num: number): boolean => {
  return hasExactTwoAdjacentDigits(num) && digitsNeverDecrease(num);
};

const countValidPasswords = (
  start: number, 
  end: number, 
  isValid: (num: number) => boolean
): number => {
  let validPasswordCount = 0;
  for (let i = start; i <= end; i++) {
    if (isValid(i)) {
      validPasswordCount++;
    }
  }
  return validPasswordCount;
};

const startRange = 359282;
const endRange = 820401;

const validPasswordCountPartOne = countValidPasswords(
  startRange, 
  endRange, 
  isValidPasswordPartOne
);
const validPasswordCountPartTwo = countValidPasswords(
  startRange, 
  endRange, 
  isValidPasswordPartTwo
);

console.log(`Number of valid passwords for part one: ${validPasswordCountPartOne}`);
console.log(`Number of valid passwords for part two: ${validPasswordCountPartTwo}`);