const seedrandom = require("seedrandom");
const fs = require("fs");

// Hash from block #4334000
const hash =
  "0x859cfe6d5c85eb6d69c363acafe30d3b9791a585c413844adf9b35cd4b0b418d";

// isolate all numeric values from hash. ouput: '08596585669363303979158541384493540418'

const seed = hash.replace(/[a-zA-Z]/g, "");

console.log("seed", seed);

const rng = seedrandom(seed);

const data = JSON.parse(fs.readFileSync("leaderboard.json"));

const leaders = data.leaderboards[0].leaderboard;

const list = leaders.filter((item) => item.amount > 0);

// sort by amount in descending order
list.sort((a, b) => b.amount - a.amount);

// extracting names and weights list
const names = [];
const weights = [];
list
  .filter((item) => item["amount"] !== "0")
  .map((item) => {
    names.push(item["name"]);
    weights.push(item["amount"]);
  });

// draw 1 unique winner
const winnersList = [];
for (let round = 0; round < 1; round++) {
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
    winners[winner] = 1;
  }
});

// sort winner list from high to low
const sortedWinners = Object.entries(winners)
  .sort((a, b) => b[1] - a[1])
  .reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {});

fs.writeFileSync("drawing_winner.json", JSON.stringify(sortedWinners, null, 2));
