const fs = require('fs');
const path = require('path');

const buildPath = path.resolve(__dirname, '../artifacts/contracts');
const destinationPath = path.resolve(__dirname, '../../frontend/src/contracts');

function copyABI(contractName, contractFileName) {
  const abiPath = path.join(buildPath, `${contractFileName}.sol`, `${contractName}.json`);
  const destination = path.join(destinationPath, `${contractName}.json`);
  if (fs.existsSync(abiPath)) {
    fs.copyFileSync(abiPath, destination);
    console.log(`ABI file for ${contractName} copied to ${destination}`);
  } else {
    console.error(`ABI file for ${contractName} not found at ${abiPath}`);
  }
}

// 对应 NFT.sol 文件中的合约名称和文件名
copyABI('MyNFT', 'NFT');
copyABI('DutchAuction', 'DutchAuction');
copyABI('AuctionFactory', 'AuctionFactory');
