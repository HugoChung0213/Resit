import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AuctionFactoryABI from '../contracts/AuctionFactory.json';

const factoryAddress = '0xB9c09d7404527963ceb9C5e2310c8D5b1c03343D';

function AuctionList({ onSelectAuction }) {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    async function fetchAuctions() {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const factoryContract = new ethers.Contract(factoryAddress, AuctionFactoryABI, provider);
      const auctionAddresses = await factoryContract.getAuctions();
      setAuctions(auctionAddresses);
    }

    fetchAuctions();
  }, []);

  return (
    <div>
      <h2>Available Auctions</h2>
      <ul>
        {auctions.map((auction, index) => (
          <li key={index} onClick={() => onSelectAuction(auction)}>
            {auction}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AuctionList;
