import React, { useState } from 'react';
import { Contract, parseEther, parseUnits, Interface } from 'ethers';
import AuctionFactoryArtifact from '../contracts/AuctionFactory.json';
import MyNFTABI from '../contracts/MyNFT.json';
import  './CreateAuctionForm.css';

const CreateAuctionForm = ({ provider }) => {
  const [startingPrice, setStartingPrice] = useState('');
  const [discountRate, setDiscountRate] = useState('');
  const [nftId, setNftId] = useState('');
  const [auctionAddress, setAuctionAddress] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  const auctionFactoryAddress = process.env.REACT_APP_AUCTION_FACTORY_ADDRESS;
  const nftAddress = process.env.REACT_APP_NFT_ADDRESS;

  const ethPerDayToGweiPerSecond = 1e9 / 86400;
  const point1EthPerDayToGweiPerSecond = (0.1 * 1e9) / 86400;
  const ethPerWeekToGweiPerSecond = 1e9 / (86400 * 7);
  const point1EthPerWeekToGweiPerSecond = (0.1 * 1e9) / (86400 * 7);

  const createAuction = async (event) => {
    event.preventDefault();

    try {
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const nftContract = new Contract(nftAddress, MyNFTABI.abi, signer);

      const owner = await nftContract.ownerOf(nftId);
      if (owner.toLowerCase() !== address.toLowerCase()) {
        throw new Error('Signer is not the owner of the NFT');
      }

      console.log('Signer is the owner of the NFT');

      const auctionFactoryContract = new Contract(auctionFactoryAddress, AuctionFactoryArtifact.abi, signer);
      const discountRateInWei = parseUnits(discountRate, 'gwei');

      // 创建拍卖
      console.log('Begin create auction');
      const tx = await auctionFactoryContract.createAuction(
        parseEther(startingPrice),
        discountRateInWei,
        nftAddress,
        nftId
      );
      const receipt = await tx.wait();
      console.log('Transaction receipt:', receipt);

      // 解析事件日志
      const iface = new Interface(AuctionFactoryArtifact.abi);
      const auctionCreatedEvent = iface.getEvent("AuctionCreated");

      const log = receipt.logs.find(log => {
        try {
          const parsedLog = iface.parseLog(log);
          return parsedLog.name === "AuctionCreated";
        } catch (e) {
          return false;
        }
      });

      if (log) {
        const parsedLog = iface.parseLog(log);
        const newAuctionAddress = parsedLog.args.auctionContract;

        setAuctionAddress(newAuctionAddress);
        console.log('New auction address:', newAuctionAddress);

        // 调用 approve 函数，允许新创建的拍卖合约转移 NFT
        console.log('Calling approve...');
        const approveTx = await nftContract.approve(newAuctionAddress, nftId);
        console.log('Approve transaction sent:', approveTx);
        await approveTx.wait();
        console.log('Approve transaction confirmed');

        console.log('Auction created and NFT approved');
        setShowSuccess(true);
      } else {
        throw new Error('AuctionCreated event not found in transaction receipt');
      }
    } catch (error) {
      console.error('Error creating auction:', error);
      setError('Failed to create auction. Please try again.');
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
  };

  const handleErrorClose = () => {
    setError(null);
  };

  return (
    <div className="create-auction-container">
      <h2 className="create-auction-section-title">Create Auction</h2>
      <div className="tips-container">
      <div className="tips">
        <p>Tips:</p>
        <p>1 ETH/day = {ethPerDayToGweiPerSecond.toFixed(2)} Gwei/s</p>
        <p>0.1 ETH/day = {point1EthPerDayToGweiPerSecond.toFixed(2)} Gwei/s</p>
        <p>1 ETH/week = {ethPerWeekToGweiPerSecond.toFixed(2)} Gwei/s</p>
        <p>0.1 ETH/week = {point1EthPerWeekToGweiPerSecond.toFixed(2)} Gwei/s</p>
      </div>
      </div>
      <form onSubmit={createAuction} className="create-auction-form">
        <div className="form-group">
        <input
          type="text"
          placeholder="Starting Price (ETH)"
          value={startingPrice}
          onChange={(e) => setStartingPrice(e.target.value)}
        />
        <input
          type="text"
          placeholder="Discount Rate (Gwei/s)"
          value={discountRate}
          onChange={(e) => setDiscountRate(e.target.value)}
        />
        <input
          type="text"
          placeholder="NFT ID"
          value={nftId}
          onChange={(e) => setNftId(e.target.value)}
        />
        <button type="submit">Create Auction</button>
        </div>
      </form>
      {auctionAddress && (
        <p>Auction created at address: {auctionAddress}</p>
      )}
      {showSuccess && (
        <div className="modal">
          <div className="modal-content">
            <h3>Success!</h3>
            <p>Auction created and NFT approved successfully.</p>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
      {error && (
        <div className="modal">
          <div className="modal-content">
            <h3>Error</h3>
            <p>{error}</p>
            <button onClick={handleErrorClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAuctionForm;
