# carnage-raffle

To pick the lottery winners via a publicly verifiable random seed - we’ll be using the hash from Exosama network block #3245500 which will be executed in ~30 minutes. The alphabetic values will be stripped from the hash and only the numeric values will be used as the seed. As an example, a hash value of ‘0x83f45ab9b4136b753ba624002e87b6711e066f77aee812f9f17937a84de9bbe2’ will be converted to ‘0834594136753624002876711066778129179378492
’

```
yarn
node index.js
```

Then check [winners](./winners.json).
