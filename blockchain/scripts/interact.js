async function main() {
    const [deployer] = await ethers.getSigners();
  
    // 替换为你部署的 AuctionFactory 合约地址
    const auctionFactoryAddress = "YOUR_AUCTION_FACTORY_CONTRACT_ADDRESS";
    
    const AuctionFactory = await ethers.getContractFactory("AuctionFactory");
    const auctionFactory = AuctionFactory.attach(auctionFactoryAddress);
  
    // 创建新的拍卖
    const tx = await auctionFactory.createAuction(
      ethers.utils.parseEther("1"), // 起始价格 1 ETH
      ethers.utils.parseUnits("100", "wei"), // 折扣率 100 wei/s
      "0xYourNFTContractAddress", // 替换为你的 NFT 合约地址
      1 // NFT ID
    );
    await tx.wait();
    console.log("Auction created");
  
    // 获取所有拍卖
    const auctions = await auctionFactory.getAuctions();
    console.log("Auctions:", auctions);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  