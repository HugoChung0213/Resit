import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import AuctionFactoryABI from '../contracts/AuctionFactory.json';
import DutchAuctionABI from '../contracts/DutchAuction.json';
import MyNFTABI from '../contracts/MyNFT.json';
import './AuctionList.css';

const factoryAddress = process.env.REACT_APP_AUCTION_FACTORY_ADDRESS;

function AuctionList({ provider }) {
  const [auctions, setAuctions] = useState([]);
  const [completedAuctions, setCompletedAuctions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAuctions() {
      if (!provider) {
        console.error("No provider found");
        return;
      }

      const factoryContract = new ethers.Contract(factoryAddress, AuctionFactoryABI.abi, provider);
      const auctionAddresses = await factoryContract.getAuctions();

      const activeAuctions = [];
      const finishedAuctions = [];

      for (const address of auctionAddresses) {
        const auctionContract = new ethers.Contract(address, DutchAuctionABI.abi, provider);
        const nftAddress = await auctionContract.nft();
        const nftId = (await auctionContract.nftId()).toString(); // Ensure nftId is a string
        const nftContract = new ethers.Contract(nftAddress, MyNFTABI.abi, provider);
        
        const expiresAt = await auctionContract.expiresAt();
        const hasEnded = Date.now() / 1000 > expiresAt;
        const nftOwner = await nftContract.ownerOf(nftId);
        const seller = await auctionContract.seller();

        const tokenURI = await nftContract.tokenURI(nftId);

        const auctionData = {
          address,
          tokenURI,
          nftId,
        };

        if (hasEnded || nftOwner !== seller) {
          finishedAuctions.push(auctionData);
        } else {
          activeAuctions.push(auctionData);
        }
      }

      setAuctions(activeAuctions);
      setCompletedAuctions(finishedAuctions);
    }

    fetchAuctions();
  }, [provider]);

  const handleSelectAuction = (auction) => {
    navigate(`/auction/${auction.address}`);
  };

  const handleSelectCompletedAuction = (auction) => {
    navigate(`/completed-auction/${auction.address}`);
  };

  return (
    <div>
      <h2 className="auction-section-title">Available Auctions</h2>
      <ul className="auction-list">
        {auctions.map((auction, index) => (
          <li key={index} onClick={() => handleSelectAuction(auction)} className="auction-item">
            <div className="nft-id">{auction.nftId}</div>
            <img src={auction.tokenURI} alt={`NFT ${auction.nftId}`} className="auction-image" />
          </li>
        ))}
      </ul>

      <h2 className="auction-section-title">Completed Auctions</h2>
      <ul className="auction-list">
        {completedAuctions.map((auction, index) => (
          <li key={index} onClick={() => handleSelectCompletedAuction(auction)} className="auction-item">
            <div className="nft-id">{auction.nftId}</div>
            <img src={auction.tokenURI} alt={`NFT ${auction.nftId}`} className="auction-image" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AuctionList;
