const seedrandom = require("seedrandom");
const fs = require("fs");

// Example hash from block #4160000
const hash =
  "0xf0bfbe05a99bfd32f40a50e79d730152a6f2d6f1f55d0369907726b5caa7ade0";

console.log("Hash used: ", hash);

// Isolate all numeric values from hash. Output: '000599324050797301526261550369907726570'

const seed = hash.replace(/[a-zA-Z]/g, "");

console.log("Seed generated from hash", seed);

const rng = seedrandom(seed);

console.log("Random number generated from seed", rng);

const data = JSON.parse(fs.readFileSync("open_entities.json"));

const buyers = data.open_entity;

const modifiedBuyers = buyers.map((buyer, index) => ({
  ...buyer,
  order: index + 1,
  chanceOfWinningMoonsama: 0.0005, // 0.05% chance of winning (expressed as a decimal)
  chanceOfWinningExosama: 0.005, // 0.5% chance of winning (expressed as a decimal)
}));

console.log("Amount of lootbox purchases: ", modifiedBuyers.length);

// Generate Moonsama winners based on giving each buyer a 0.05% chance of winning
const winnersMoonsama = modifiedBuyers.filter(
  (buyer) => rng() <= buyer.chanceOfWinningMoonsama
);

if (winnersMoonsama.length > 0) {
  console.log("The Moonsama winner(s) is/are: ");
  winnersMoonsama.forEach((winner) => {
    console.log("Moonsama Winner", winner);
  });
} else {
  console.log("No Moonsama winners chosen.");
}

// Generate Exosama winners based on giving each buyer a 0.5% chance of winning
const winnersExosama = modifiedBuyers.filter(
  (buyer) => rng() <= buyer.chanceOfWinningExosama
);

if (winnersExosama.length > 0) {
  console.log("The Exosama winner(s) is/are: ");
  winnersExosama.forEach((winner) => {
    console.log("Exosama Winner: ", winner);
  });
} else {
  console.log("No Exosama winners chosen.");
}

const winners = {
  winnersMoonsama,
  winnersExosama,
};

// Save winners as JSON to a file
fs.writeFileSync(
  "lootbox_raffle_winners.json",
  JSON.stringify(winners, null, 2)
);

console.log("Winners saved to lootbox_raffle_winners.json");
