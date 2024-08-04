import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import MyNFTABI from '../contracts/MyNFT.json';
import './MyNFTList.css'; // 导入 CSS 文件

const nftAddress = process.env.REACT_APP_NFT_ADDRESS;
const infuraProjectId = process.env.REACT_APP_INFURA_PROJECT_ID;

const MyNFTList = ({ provider }) => {
  const [nfts, setNfts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNFTs = async () => {
      let tempProvider = provider;

      if (!tempProvider) {
        tempProvider = new ethers.InfuraProvider('sepolia', infuraProjectId);
      }

      try {
        const signer = await tempProvider.getSigner();
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

        const nftDetails = await Promise.all(
          nfts.map(async (nftId) => {
            const tokenURI = await nftContract.tokenURI(nftId);
            return { nftId: nftId.toString(), tokenURI };
          })
        );

        console.log('NFTs:', nftDetails);
        setNfts(nftDetails);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      }
    };

    fetchNFTs();
  }, [provider]);

  const handleView = (nftId) => {
    navigate(`/nft/${nftId}`);
  };

  return (
    <div className="nft-list-container">
      <h2 className="nft-section-title">My NFTs</h2>
      <ul className="nft-list">
        {nfts.map((nft, index) => (
          <li key={index} className="nft-item" onClick={() => handleView(nft.nftId)}>
            <div className="nft-id">{nft.nftId}</div>
            <img src={nft.tokenURI} alt={`NFT ${nft.nftId}`} className="nft-image" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyNFTList;
