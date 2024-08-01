import React from 'react';
import CreateNFT from '../components/CreateNFT';

const CreateNFTPage = ({ provider }) => {
  return (
    <div>
      <h2>Create NFT</h2>
      <CreateNFT provider={provider} />
    </div>
  );
};

export default CreateNFTPage;
