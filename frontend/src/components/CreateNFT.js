import React, { useState } from 'react';
import { ethers } from 'ethers';
import MyNFTABI from '../contracts/MyNFT.json';
import './CreateNFT.css'; // 导入 CSS 文件

const nftAddress = '0x1b9a8aFC27A9D19768967Be11153f8d1CB6b221D';

function CreateNFT() {
  const [recipient, setRecipient] = useState('');
  const [nftId, setNftId] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleMint = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask to use this feature.');
        return;
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const nftContract = new ethers.Contract(nftAddress, MyNFTABI.abi, signer);

      // 检查 NFT ID 是否已存在
      try {
        await nftContract.ownerOf(nftId);
        setError('NFT ID already exists.');
        return;
      } catch (err) {
        // 如果 ownerOf 调用失败，说明该 NFT ID 不存在，可以继续 mint
        if (err.code !== 'CALL_EXCEPTION') {
          throw err;
        }
      }

      const transaction = await nftContract.mint(recipient, nftId);
      await transaction.wait();

      console.log('NFT minted successfully');
      setShowSuccess(true);
      setRecipient('');
      setNftId('');
    } catch (err) {
      console.error('Minting error:', err);
      setError('Failed to mint NFT. Please try again.');
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
  };

  const handleErrorClose = () => {
    setError(null);
  };

  return (
    <div>
      <h2>Create NFT</h2>
      <input
        type="text"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Recipient Address"
      />
      <input
        type="text"
        value={nftId}
        onChange={(e) => setNftId(e.target.value)}
        placeholder="NFT ID"
      />
      <button onClick={handleMint}>Mint NFT</button>

      {showSuccess && (
        <div className="modal">
          <div className="modal-content">
            <h3>Success!</h3>
            <p>NFT minted successfully.</p>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      )}

      {error && (
        <div className="modal">
          <div className="modal-content">
            <h3>Error</h3>
            <p>{error}</p>
            <button onClick={handleErrorClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateNFT;
