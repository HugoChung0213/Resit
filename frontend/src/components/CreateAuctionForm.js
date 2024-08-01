import React, { useState } from 'react';
import { Contract, parseEther, parseUnits } from 'ethers'; // 直接导入所需函数
import AuctionFactoryArtifact from '../contracts/AuctionFactory.json'; // 确保路径正确

const CreateAuctionForm = ({ provider }) => {
  const [startingPrice, setStartingPrice] = useState('');
  const [discountRate, setDiscountRate] = useState('');
  const [nftAddress, setNftAddress] = useState('');
  const [nftId, setNftId] = useState('');

  const auctionFactoryAddress = '0x3aEEf6C22d550920Ce9F1377ad77744DFCcad427';

  const createAuction = async () => {
    try {
      const signer = await provider.getSigner();
      const auctionFactoryContract = new Contract(auctionFactoryAddress, AuctionFactoryArtifact.abi, signer);

      const tx = await auctionFactoryContract.createAuction(
        parseEther(startingPrice),
        parseUnits(discountRate, 'wei'),
        nftAddress,
        nftId
      );
      await tx.wait();
      console.log('Auction created');
    } catch (error) {
      console.error('Error creating auction:', error);
    }
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
