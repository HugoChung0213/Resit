/* global BigInt */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import DutchAuctionABI from '../contracts/DutchAuction.json';
import MyNFTABI from '../contracts/MyNFT.json';
import './AuctionDetails.css';

function AuctionDetails() {
  const { auctionAddress } = useParams();
  const [details, setDetails] = useState({});
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    let auctionContract;
    async function fetchDetails() {
      if (!auctionAddress) {
        console.error('No auction address provided');
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        auctionContract = new ethers.Contract(auctionAddress, DutchAuctionABI.abi, provider);
        const nft = await auctionContract.nft();
        const nftId = (await auctionContract.nftId()).toString(); // Convert BigInt to string
        const nftContract = new ethers.Contract(nft, MyNFTABI.abi, provider);
        const owner = await nftContract.ownerOf(nftId);

        console.log('Current owner of the NFT:', owner);

        const getPrice = (await auctionContract.getPrice()).toString(); // Convert BigInt to string
        const discountRate = (await auctionContract.discountRate()).toString(); // Convert BigInt to string
        const startAt = (await auctionContract.startAt()).toString(); // Convert BigInt to string
        const expiresAt = (await auctionContract.expiresAt()).toString(); // Convert BigInt to string

        const signer = await provider.getSigner();
        const address = (await signer.getAddress()).toLowerCase();

        setIsOwner(address === owner.toLowerCase());
        setDetails({ nft, nftId, owner: owner.toLowerCase(), getPrice, discountRate, startAt, expiresAt });
        setLoading(false);

        // 监听 Debug 事件
        auctionContract.on('Debug', (message, seller, currentOwner) => {
          console.log(`Debug event - ${message}:`);
          console.log('Seller:', seller);
          console.log('Current Owner:', currentOwner);
        });
      } catch (error) {
        console.error('Error fetching auction details:', error);
        setLoading(false);
      }
    }

    fetchDetails();
    const intervalId = setInterval(fetchDetails, 5000);

    // 清理函数，取消事件监听
    return () => {
      clearInterval(intervalId);
      if (auctionContract) {
        auctionContract.removeAllListeners('Debug');
      }
    };
  }, [auctionAddress]);

  const handleBid = async (event) => {
    event.preventDefault();

    if (!bidAmount || isNaN(bidAmount)) {
      alert('Please enter a valid bid amount in ETH.');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = (await signer.getAddress()).toLowerCase();

      if (address === details.owner) {
        alert('You cannot bid on your own NFT.');
        return;
      }

      const balance = await provider.getBalance(address);
      const bidAmountWei = ethers.parseUnits(bidAmount, 'ether');
      const currentPriceWei = ethers.parseUnits(details.getPrice, 'wei');

      if (BigInt(bidAmountWei) < BigInt(currentPriceWei)) {
        alert('Your bid is lower than the current price.');
        return;
      }

      if (BigInt(balance) < BigInt(bidAmountWei)) {
        alert('Insufficient funds for this bid.');
        return;
      }

      const auctionContract = new ethers.Contract(auctionAddress, DutchAuctionABI.abi, signer);
      const tx = await auctionContract.buy({ value: bidAmountWei });
      await tx.wait();
      alert('Bid placed successfully');
    } catch (error) {
      console.error('Error placing bid:', error);
      alert('Failed to place bid. Please try again.');
    }
  };

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
    <div className="auction-details-container">
      <h2 className="auction-details-header">Auction Details</h2>
      <div className="auction-details-content">
        <p>NFT Address: {details.nft}</p>
        <p>NFT ID: {details.nftId}</p>
        <p>Seller: {details.owner}</p>
        <p>Current Price: {ethers.formatUnits(details.getPrice || '0', 'ether')} ETH</p>
        <p>Discount Rate: {ethers.formatUnits(details.discountRate, 'gwei')} Gwei/s</p>
        <p>Start At: {details.startAt ? formatDate(details.startAt) : 'Invalid Date'}</p>
        <p>Expires At: {details.expiresAt ? formatDate(details.expiresAt) : 'Invalid Date'}</p>
        <form onSubmit={handleBid} className="form-group">
          <input
            type="text"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder="Bid Amount in ETH"
            disabled={isOwner}
          />
          <button type="submit" disabled={isOwner}>Bid</button>
        </form>
        {isOwner && <p>You cannot bid on your own NFT.</p>}
      </div>
    </div>
  );
}

export default AuctionDetails;
