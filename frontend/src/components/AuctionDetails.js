import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import DutchAuctionABI from '../contracts/DutchAuction.json';

function AuctionDetails({ auctionAddress }) {
  const [details, setDetails] = useState({});
  const [bidAmount, setBidAmount] = useState('');

  useEffect(() => {
    async function fetchDetails() {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const auctionContract = new ethers.Contract(auctionAddress, DutchAuctionABI, provider);

      const nft = await auctionContract.nft();
      const nftId = await auctionContract.nftId();
      const seller = await auctionContract.seller();
      const startingPrice = await auctionContract.startingPrice();
      const discountRate = await auctionContract.discountRate();
      const startAt = await auctionContract.startAt();
      const expiresAt = await auctionContract.expiresAt();

      setDetails({ nft, nftId, seller, startingPrice, discountRate, startAt, expiresAt });
    }

    fetchDetails();
  }, [auctionAddress]);

  const handleBid = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    const auctionContract = new ethers.Contract(auctionAddress, DutchAuctionABI, signer);

    await auctionContract.buy({ value: ethers.parseEther(bidAmount) });
  };

  return (
    <div>
      <h2>Auction Details</h2>
      <p>NFT Address: {details.nft}</p>
      <p>NFT ID: {details.nftId}</p>
      <p>Seller: {details.seller}</p>
      <p>Starting Price: {ethers.formatEther(details.startingPrice || 0)} ETH</p>
      <p>Discount Rate: {details.discountRate} wei/s</p>
      <p>Start At: {new Date(details.startAt * 1000).toLocaleString()}</p>
      <p>Expires At: {new Date(details.expiresAt * 1000).toLocaleString()}</p>
      <div>
        <input
          type="text"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder="Bid Amount in ETH"
        />
        <button onClick={handleBid}>Bid</button>
      </div>
    </div>
  );
}

export default AuctionDetails;
