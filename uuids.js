const seedrandom = require("seedrandom");
const fs = require("fs");

// Hash from block #7328000
const hash =
  "0x690a0f5cbab0b78c059ff0ea571c4861e31b97eed74e9be420826ed2cf593762";

// isolate all numeric values from hash. ouput: '0690050780590571486131977494208262593762'

const seed = hash.replace(/[a-zA-Z]/g, "");

console.log("seed", seed);

const rng = seedrandom(seed);

const data = JSON.parse(fs.readFileSync("leaderboard.json"));

const leaders = data.leaderboards[0].leaderboard;

const list = leaders.filter((item) => item.amount > 0);

// sort by amount in descending order
list.sort((a, b) => b.amount - a.amount);

// get top 10 and remove them from the list
const topTen = list.splice(0, 10);

const ten = topTen.reduce((acc, { playerId }) => {
  acc[`${playerId}`] = 1000;
  return acc;
}, {});

// extracting names and weights list
const names = [];
const weights = [];
list
  .filter((item) => item["amount"] !== "0")
  .map((item) => {
    names.push(item["playerId"]);
    weights.push(item["amount"]);
  });

// draw 90 winners
const winnersList = [];
for (let round = 0; round < 90; round++) {
  const rnd = rng();

  let random = rnd * weights.reduce((a, b) => a + b, 0);

  let i = 0;
  for (i; i < weights.length; i++) {
    if (random < weights.slice(0, i + 1).reduce((a, b) => a + b, 0)) {
      const winner = names[i];
      if (winnersList.includes(winner)) {
        // continue drawing until unique winner is found
        round--;
        break;
      } else {
        winnersList.push(winner);
        break;
      }
    }
  }
}

// count winners
const winners = {};
winnersList.map((winner) => {
  if (winners[winner]) {
    winners[winner]++;
  } else {
    winners[winner] = 1000;
  }
});

// sort winner list from high to low
const sortedWinners = Object.entries(winners)
  .sort((a, b) => b[1] - a[1])
  .reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {});

const final = { ...ten, ...sortedWinners };

fs.writeFileSync("uuids.json", JSON.stringify(final, null, 2));
