require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  paths: {
    sources: "./contracts",
    tests: "./tests",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        // 使用 Ganache 提供的第一个账户的私钥
        "0x888ca7b2a5b8448d96bd6e54677776c913de296843c18e1303ee1d31c8ca97e8",
        "0x4c7feccd3537f07cad073ce5d2d4301c015584a872461ad9103533aa5ed33d42",
        "0x623a04e530232d9f8568982553296cd5bae954822a16890b822deb718bb96305",
        // 你可以添加更多账户的私钥
      ]
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  }
};
