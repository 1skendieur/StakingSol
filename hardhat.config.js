// hardhat.config.js
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: "https://mainnet.infura.io/v3/45c662701ca94a048fc8e030cbe9ba23",
      accounts: {
        mnemonic: "0xb8FbfB42Ba50eE55664E5ef48455cEC668270285C",
      },
    },
  },
};