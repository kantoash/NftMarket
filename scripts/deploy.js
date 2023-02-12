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
  console.log("market Address", marketplace.address);// 0xa91C43dCd2B9C8B7664Cc1Bcd16581a795255232

  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(marketplace.address);
  await nft.deployed(); //deploy the NFT contract
  console.log("Nft Address", nft.address); // 0xB93232b127cA6e5FCD2B74197a93BD1346921ba6

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
