import React from 'react';
import CreateNFT from '../components/CreateNFT';

const CreateNFTPage = ({ provider }) => {
  return (
    <div>
      <CreateNFT provider={provider} />
    </div>
  );
};

export default CreateNFTPage;
