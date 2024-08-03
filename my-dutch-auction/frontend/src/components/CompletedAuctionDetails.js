// src/components/CompletedAuctionDetails.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import DutchAuctionABI from '../contracts/DutchAuction.json';
import MyNFTABI from '../contracts/MyNFT.json';
import './CompletedAuctionDetails.css';

function CompletedAuctionDetails({ auctionAddress }) {
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      if (!auctionAddress) {
        console.error('No auction address provided');
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const auctionContract = new ethers.Contract(auctionAddress, DutchAuctionABI.abi, provider);
        const nft = await auctionContract.nft();
        const nftId = (await auctionContract.nftId()).toString(); // Convert BigInt to string
        const nftContract = new ethers.Contract(nft, MyNFTABI.abi, provider);
        const owner = await nftContract.ownerOf(nftId);
        const seller = await auctionContract.seller();
        const finalPrice = await auctionContract.getPrice();

        const expiresAt = (await auctionContract.expiresAt()).toString(); // Convert BigInt to string

        setDetails({ nft, nftId, seller, owner, finalPrice: finalPrice.toString(), expiresAt });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching auction details:', error);
        setLoading(false);
      }
    }

    fetchDetails();
  }, [auctionAddress]);

  if (loading) {
    return <div className="loading">Loading auction details...</div>;
  }

  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    }).replace(/(\d+)\/(\d+)\/(\d+),/, '$3-$1-$2');
  };

  return (
    <div className="completed-auction-details-container">
      <h2 className="completed-auction-details-header">Completed Auction Details</h2>
      <div className="completed-auction-details-content">
        <p>Auction Address: <span>{auctionAddress}</span></p>
        <p>NFT Address: <span>{details.nft}</span></p>
        <p>NFT ID: <span>{details.nftId}</span></p>
        <p>Seller: <span>{details.seller}</span></p>
        <p>Owner: <span>{details.owner}</span></p>
        <p>Final Price: <span>{ethers.formatUnits(details.finalPrice, 'ether')} ETH</span></p>
        <p>Expires At: <span>{details.expiresAt ? formatDate(details.expiresAt) : 'Invalid Date'}</span></p>
      </div>
    </div>
  );
}

export default CompletedAuctionDetails;
