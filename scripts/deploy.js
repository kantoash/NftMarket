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
  console.log("market Address", marketplace.address);// 0x4a932121C00CDaB0cd2C9250E99C1d529a5556D5

  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(marketplace.address);
  await nft.deployed(); //deploy the NFT contract
  console.log("Nft Address", nft.address); // 0xB98AbCE4F51bAc20b3ff9494891eFA31BdC2bcb7

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
