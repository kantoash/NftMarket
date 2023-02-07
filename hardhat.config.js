require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
const account1 = process.env.PRIVATE_KEY
const GOERLI_URL = process.env.GOERLI_URL
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    goerli: {
      url: GOERLI_URL,
      accounts: [account1]
    }
  },
  paths: {
    artifacts: "./client/src/artifacts"
  }
};//npx hardhat run scripts/deploy.js --network goerli
