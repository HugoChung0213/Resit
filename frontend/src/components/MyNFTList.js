import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MyNFTABI from '../contracts/MyNFT.json';
import './MyNFTList.css'; // 导入 CSS 文件

const nftAddress = '0x1b9a8aFC27A9D19768967Be11153f8d1CB6b221D';

const MyNFTList = ({ provider }) => {
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

        const nftPromises = [];
        for (let i = 0; i < balance; i++) {
          nftPromises.push(nftContract.tokenOfOwnerByIndex(address, i));
        }
        const nfts = await Promise.all(nftPromises);

        console.log('NFTs:', nfts.map(nft => nft.toString()));
        setNfts(nfts.map(nft => nft.toString()));
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      }
    };

    fetchNFTs();
  }, [provider]);

  return (
    <div>
      <ul className="nft-list">
        {nfts.map((nft, index) => (
          <li key={index} className="nft-item">
            <span className="nft-id">NFT ID: {nft}</span>
            <span className="nft-action">View</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyNFTList;
