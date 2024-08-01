const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  // 打印部署者账户地址
  console.log("Deploying contracts with the account:", deployer.address);
  
  // 获取部署者账户余额 
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", balance);
  
  // 部署 AuctionFactory 合约
  try {
    const AuctionFactory = await ethers.getContractFactory("AuctionFactory");
    console.log("ContractFactory obtained for AuctionFactory");
    const auctionFactory = await AuctionFactory.deploy();
    console.log("Deployment transaction created for AuctionFactory");
    await auctionFactory.waitForDeployment();  // 等待合约部署完成
    console.log("AuctionFactory deployed to:", auctionFactory.target);
  } catch (error) {
    console.error("Failed to deploy AuctionFactory:", error);
  }

  // 部署 NFT 合约
  try {
    const NFT = await ethers.getContractFactory("MyNFT");
    console.log("ContractFactory obtained for NFT");
    const nft = await NFT.deploy();
    console.log("Deployment transaction created for NFT");
    await nft.waitForDeployment();  // 等待合约部署完成
    console.log("NFT deployed to:", nft.target);
  } catch (error) {
    console.error("Failed to deploy NFT:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
