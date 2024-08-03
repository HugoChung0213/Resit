import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MyNFTABI from '../contracts/MyNFT.json';
import './NFTDetail.css';

const nftAddress = process.env.REACT_APP_NFT_ADDRESS;

const NFTDetail = ({ provider, nftId }) => {
  const [nftDetail, setNftDetail] = useState(null);

  useEffect(() => {
    const fetchNFTDetail = async () => {
      if (!provider || !nftId) {
        return;
      }

      try {
        const signer = await provider.getSigner();
        const nftContract = new ethers.Contract(nftAddress, MyNFTABI.abi, signer);
        const owner = await nftContract.ownerOf(nftId);
        const tokenURI = await nftContract.tokenURI(nftId);

        setNftDetail({ id: nftId, owner, tokenURI });
      } catch (error) {
        console.error('Error fetching NFT detail:', error);
      }
    };

    fetchNFTDetail();
  }, [provider, nftId]);

  if (!nftDetail) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="nft-detail-container">
      <h2 className="nft-detail-header">NFT Detail</h2>
      <div className="nft-detail-content">
        <p>NFT ID: <span>{nftDetail.id}</span></p>
        <p>Owner: <span>{nftDetail.owner}</span></p>
        {nftDetail.tokenURI && (
          <div className="nft-image-container">
            <img src={nftDetail.tokenURI} alt={`NFT ${nftDetail.id}`} className="nft-image" />
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTDetail;
