import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import AuctionFactoryABI from '../contracts/AuctionFactory.json';

const factoryAddress = '0x3aEEf6C22d550920Ce9F1377ad77744DFCcad427';

function AuctionList({ provider }) {
  const [auctions, setAuctions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAuctions() {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const factoryContract = new ethers.Contract(factoryAddress, AuctionFactoryABI.abi, provider);
      const auctionAddresses = await factoryContract.getAuctions();
      setAuctions(auctionAddresses);
    }

    fetchAuctions();
  }, []);

  const handleSelectAuction = (auction) => {
    navigate(`/auction/${auction}`);
  };

  return (
    <div>
      <h2>Available Auctions</h2>
      <ul>
        {auctions.map((auction, index) => (
          <li key={index} onClick={() => handleSelectAuction(auction)}>
            {auction}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AuctionList;
   