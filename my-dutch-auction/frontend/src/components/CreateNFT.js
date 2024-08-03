import React, { useState } from 'react';
import { ethers } from 'ethers';
import MyNFTABI from '../contracts/MyNFT.json';
import uploadToIPFS from '../utils/uploadToIPFS';
import './CreateNFT.css'; // 导入 CSS 文件

const nftAddress = process.env.REACT_APP_NFT_ADDRESS;

function CreateNFT() {
  const [recipient, setRecipient] = useState('');
  const [nftId, setNftId] = useState('');
  const [file, setFile] = useState(null);
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

      if (!file) {
        setError('Please select a file to mint as NFT.');
        return;
      }

      const ipfsHash = await uploadToIPFS(file);
      const tokenURI = `https://ipfs.io/ipfs/${ipfsHash}`;

      const transaction = await nftContract.mint(recipient, nftId, tokenURI);
      await transaction.wait();

      console.log('NFT minted successfully');
      setShowSuccess(true);
      setRecipient('');
      setNftId('');
      setFile(null);
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
    <div className="create-nft-container">
      <h2 className="create-nft-section-title">Create NFT</h2>
      <form className="create-nft-form">
        <div className="form-group">
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Recipient Address"
            className="input-recipient"
          />
          <input
            type="text"
            value={nftId}
            onChange={(e) => setNftId(e.target.value)}
            placeholder="NFT ID"
            className="input-nftId"
          />
          <div className="file-input-wrapper">
            <input
              type="file"
              id="fileInput"
              className="file-input"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="fileInput" className="file-label">Choose File</label>
          </div>
          <button type="button" onClick={handleMint} className="button-mint">Mint NFT</button>
        </div>
      </form>

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
