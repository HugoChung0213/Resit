import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import DutchAuctionABI from '../contracts/DutchAuction.json';
import MyNFTABI from '../contracts/MyNFT.json';

function AuctionDetails() {
  const { auctionAddress } = useParams();
  const [details, setDetails] = useState({});
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      if (!auctionAddress) {
        console.error('No auction address provided');
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        if (!provider) {
          console.error('No provider found');
          return;
        }

        const auctionContract = new ethers.Contract(auctionAddress, DutchAuctionABI.abi, provider);

        console.log('Fetching details from contract at address:', auctionAddress);

        const nft = await auctionContract.nft();
        const nftId = (await auctionContract.nftId()).toString(); // Convert BigInt to string

        const nftContract = new ethers.Contract(nft, MyNFTABI.abi, provider);
        const owner = await nftContract.ownerOf(nftId);

        const getPrice = (await auctionContract.getPrice()).toString(); // Convert BigInt to string
        const discountRate = (await auctionContract.discountRate()).toString(); // Convert BigInt to string
        const startAt = (await auctionContract.startAt()).toString(); // Convert BigInt to string
        const expiresAt = (await auctionContract.expiresAt()).toString(); // Convert BigInt to string

        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        setIsOwner(address.toLowerCase() === owner.toLowerCase());
        setDetails({ nft, nftId, owner, getPrice, discountRate, startAt, expiresAt });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching auction details:', error);
        setLoading(false);
      }
    }

    fetchDetails();
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
      const address = await signer.getAddress();

      if (address.toLowerCase() === details.owner.toLowerCase()) {
        alert('You cannot bid on your own NFT.');
        return;
      }

      const balance = await provider.getBalance(address);
      const bidAmountWei = ethers.parseEther(bidAmount);

      if (balance < bidAmountWei) {
        alert('Insufficient funds for this bid.');
        return;
      }

      const auctionContract = new ethers.Contract(auctionAddress, DutchAuctionABI.abi, signer);

      try {
        await auctionContract.buy({ value: bidAmountWei });
        alert('Bid placed successfully');
      } catch (error) {
        console.error('Error placing bid:', error);
        alert('Bid placed but waiting for the auction price to drop to your bid.');
      }
    } catch (error) {
      console.error('Error placing bid:', error);
      alert('Failed to place bid. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading auction details...</div>;
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
    <div>
      <h2>Auction Details</h2>
      <p>NFT Address: {details.nft}</p>
      <p>NFT ID: {details.nftId}</p>
      <p>Seller: {details.owner}</p>
      <p>Current Price: {ethers.formatEther(details.getPrice || '0')} ETH</p>
      <p>Discount Rate: {details.discountRate} wei/s</p>
      <p>Start At: {details.startAt ? formatDate(details.startAt) : 'Invalid Date'}</p>
      <p>Expires At: {details.expiresAt ? formatDate(details.expiresAt) : 'Invalid Date'}</p>
      <form onSubmit={handleBid}>
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
  );
}

export default AuctionDetails;
