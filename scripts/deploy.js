// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  //   const Market = await ethers.getContractFactory("NFTMarket");
  // const market = await Market.deploy();
  // await market.deployed(); //deploy the NFTMarket contract
  // const marketAddress = market.address;

  // const NFT = await ethers.getContractFactory("NFT");
  // const nft = await NFT.deploy(marketAddress);
  // await nft.deployed(); //deploy the NFT contract
  // const nftContractAddress = nft.address;

  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(ethers.utils.parseEther('0.05'));
  await marketplace.deployed(); //deploy the NFTMarket contract
  console.log("market Address", marketplace.address);// 0xe430B30AD78cD6C8222ba818bDc1D110FF05EE46

  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(marketplace.address);
  await nft.deployed(); //deploy the NFT contract
  console.log("Nft Address", nft.address); // 0x545De0c1eb3DfF2b89BC0B6455ABcA37ce70aE64
   
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
