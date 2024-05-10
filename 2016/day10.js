const fs = require('fs');

function initializeBots(instructions) {
  const bots = {};
  const outputs = {};

  instructions.forEach(instruction => {
    if (instruction.startsWith("value")) {
      const [, value, bot] = instruction.match(/value (\d+) goes to bot (\d+)/);
      bots[bot] = bots[bot] || [];
      bots[bot].push(+value);
    }
  });

  return { bots, outputs };
}

function executeInstructions(instructions, bots, outputs, lowMicrochip, highMicrochip) {
  let changes = true;
  let responsibleBotId = null;

  while(changes) {
    changes = false;
    instructions.forEach(instruction => {
      if (instruction.startsWith("bot")) {
        const [, botId, lowToType, lowTo, highToType, highTo] =
          instruction.match(/bot (\d+) gives low to (bot|output) (\d+) and high to (bot|output) (\d+)/);
        const bot = bots[botId];
        if (bot && bot.length === 2) {
          const [low, high] = bot.sort((a, b) => a - b);
          if (low === lowMicrochip && high === highMicrochip) {
            responsibleBotId = botId;
          }
          distributeChip(low, lowTo, lowToType, bots, outputs);
          distributeChip(high, highTo, highToType, bots, outputs);
          bots[botId] = [];
          changes = true;
        }
      }
    });
  }

  return responsibleBotId;
}

function distributeChip(chip, to, toType, bots, outputs) {
  if (toType == "bot") {
    bots[to] = bots[to] || [];
    bots[to].push(chip);
  } else {
    outputs[to] = chip;
  }
}

function multiplyOutputChips(outputs, ...outputIds) {
  return outputIds.reduce((acc, id) => acc * outputs[id], 1);
}

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.log('Error reading file: ', err);
    return;
  }

  const instructions = data.trim().split('\n');
  const lowMicrochip = 17;
  const highMicrochip = 61;

  const { bots, outputs } = initializeBots(instructions);

  const responsibleBot = executeInstructions(instructions, bots, outputs, lowMicrochip, highMicrochip);
  const productOfValues = multiplyOutputChips(outputs, '0', '1', '2');

  console.log('Number of the bot: ', responsibleBot);
  console.log('Multiply together the values of outputs 0, 1, and 2: ', productOfValues)
})