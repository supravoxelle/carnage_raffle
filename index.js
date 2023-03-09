const seedrandom = require('seedrandom')
const fs = require('fs')

const rng = seedrandom('696969')
const ethers = require('ethers')

const list = JSON.parse(fs.readFileSync('staking_results.json', 'utf8'))

// extracting addresses and weights list
const addresses = []
const weights = []
list.filter(item => item.safari_tokens_total !== '0').map((item) => {
    addresses.push(item.wallet_address)
    weights.push(Math.round(ethers.formatUnits(item.safari_tokens_total, 'gwei')))
})

// cumulating weights
const cumulated = weights.slice()
for (let i = 0; i < cumulated.length; i++) {
    cumulated[i] += cumulated[i - 1] || 0;
}
console.log(addresses.length, weights.length, cumulated.length)

// drawing
const draws = []
for (let round = 0; round < 400; round++) {
    const rnd = rng()

    let random = rnd * cumulated[cumulated.length - 1];

    let i = 0
    for (i; i < cumulated.length; i++)
        if (cumulated[i] > random)
            break;

    draws.push(i)
}

// counting winners
const winners = {}
draws.map((draw) => {
    const addy = addresses[draw]
    if (winners[addy]) {
        winners[addy]++
    } else {
        winners[addy] = 1
    }
})

// double check
let total = 0
Object.keys(winners).map((addy) => {
    total += winners[addy]
})
console.log('Total samples:', total)

fs.writeFileSync('winners.json', JSON.stringify(winners, null, 2))
console.log('./winners.json')
