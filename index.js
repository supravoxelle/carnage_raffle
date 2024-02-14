const seedrandom = require("seedrandom");
const fs = require("fs");

// Hash from block #8294000
const hash =
  "0x093efa911694a307448ce78e88aecfb56c740f0e4c9ea3eff1e6b01868ff2022";

// isolate all numeric values from hash. ouput: '0093911694307448788856740049316018682022'

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

const ten = topTen.reduce((acc, { name }) => {
  acc[`${name}`] = 1;
  return acc;
}, {});

// extracting names and weights list
const names = [];
const weights = [];
list
  .filter((item) => item["amount"] !== "0")
  .map((item) => {
    names.push(item["name"]);
    weights.push(item["amount"]);
  });

// draw 90 unique winners
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

const final = { ...ten, ...sortedWinners };

fs.writeFileSync("winners.json", JSON.stringify(final, null, 2));
