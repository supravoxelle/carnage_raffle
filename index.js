const seedrandom = require("seedrandom");
const fs = require("fs");

// Hash from block #3244500
const hash =
  "0x83f45ab9b4136b753ba624002e87b6711e066f77aee812f9f17937a84de9bbe9";

// isolate all numeric values from hash e.g 0834594136753624002876711066778129179378492
const seed = hash.replace(/[a-zA-Z]/g, "");

const rng = seedrandom(seed);

const list = JSON.parse(fs.readFileSync("ticket_totals.json", "utf8"));

const winners = {};

// extracting names and weights list
const names = [];
const weights = [];
list
  .filter((item) => item["amount"] !== "0")
  .map((item) => {
    //console.log("item", item);
    names.push(item["name"]);
    weights.push(item["amount"]);
    winners[item["name"]] = 0;
  });

// cumulating weights
const cumulated = weights.slice();
for (let i = 0; i < cumulated.length; i++) {
  cumulated[i] += cumulated[i - 1] || 0;
}
//console.log(names.length, weights.length, cumulated.length);

// drawing
const draws = [];
for (let round = 0; round < 90; round++) {
  const rnd = rng();

  let random = rnd * cumulated[cumulated.length - 1];

  let i = 0;
  for (i; i < cumulated.length; i++) if (cumulated[i] > random) break;

  draws.push(i);
}

// counting winners
draws.map((draw) => {
  const addy = names[draw];
  if (winners[addy]) {
    winners[addy]++;
  } else {
    winners[addy] = 1;
  }
});

// double check
let total = 0;
Object.keys(winners).map((addy) => {
  total += winners[addy];
});

const sortedWinners = Object.entries(winners)
  .sort((a, b) => b[1] - a[1])
  .reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {});

const totals = Object.values(winners).reduce((acc, val) => acc + val, 0);
console.log(totals);

fs.writeFileSync("winners.json", JSON.stringify(sortedWinners, null, 2));
//console.log("./winners.json");
