# carnage-raffle

To pick the lottery winners via a publicly verifiable random seed - we’ll be using the hash from Exosama network block #5149400. The alphabetic values will be stripped from the hash and only the numeric values will be used as the seed.

https://explorer.exosama.com/block/5149400/transactions

```
yarn
node index.js
```

Then check [winners](./winners.json).

# lootbox-raffle-test

to test the lootbox raffle logic:

```
yarn
cd lootbox
node index.js

```
