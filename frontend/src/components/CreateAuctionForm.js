import React, { useState } from 'react';
import { Contract, parseEther, parseUnits } from 'ethers'; // 直接导入所需函数
import AuctionFactoryABI from '../contracts/AuctionFactory.json';

const CreateAuctionForm = ({ provider }) => {
  const [startingPrice, setStartingPrice] = useState('');
  const [discountRate, setDiscountRate] = useState('');
  const [nftAddress, setNftAddress] = useState('');
  const [nftId, setNftId] = useState('');

  const auctionFactoryAddress = '0xB9c09d7404527963ceb9C5e2310c8D5b1c03343D';

  const createAuction = async () => {
    const signer = await provider.getSigner();
    const auctionFactoryContract = new Contract(auctionFactoryAddress, AuctionFactoryABI, signer);

    const tx = await auctionFactoryContract.createAuction(
      parseEther(startingPrice),
      parseUnits(discountRate, 'wei'),
      nftAddress,
      nftId
    );
    await tx.wait();
    console.log('Auction created');
  };

  return (
    <div>
      <h2>Create Auction</h2>
      <input
        type="text"
        placeholder="Starting Price (ETH)"
        value={startingPrice}
        onChange={(e) => setStartingPrice(e.target.value)}
      />
      <input
        type="text"
        placeholder="Discount Rate (wei/s)"
        value={discountRate}
        onChange={(e) => setDiscountRate(e.target.value)}
      />
      <input
        type="text"
        placeholder="NFT Address"
        value={nftAddress}
        onChange={(e) => setNftAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="NFT ID"
        value={nftId}
        onChange={(e) => setNftId(e.target.value)}
      />
      <button onClick={createAuction}>Create Auction</button>
    </div>
  );
};

export default CreateAuctionForm;
