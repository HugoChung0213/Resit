import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MyNFTABI from '../contracts/MyNFT.json';

const nftAddress = '0x3367C92BF2b029A5234563316E96d18F02521752';

const MyNFTListPage = ({ provider }) => {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!provider) {
        console.log('No provider found');
        return;
      }

      try {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        console.log('Using address:', address);

        const nftContract = new ethers.Contract(nftAddress, MyNFTABI.abi, signer);
        const balance = await nftContract.balanceOf(address);
        console.log('Balance:', balance.toString());

        const nfts = [];
        for (let i = 0; i < balance; i++) {
          const nftId = await nftContract.tokenOfOwnerByIndex(address, i);
          nfts.push(nftId.toString());
        }
        console.log('NFTs:', nfts);

        setNfts(nfts);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      }
    };

    fetchNFTs();
  }, [provider]);

  return (
    <div>
      <h2>My NFTs</h2>
      <ul>
        {nfts.map((nft, index) => (
          <li key={index}>NFT ID: {nft}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyNFTListPage;
