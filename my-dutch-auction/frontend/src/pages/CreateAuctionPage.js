import React from 'react';
import CreateAuctionForm from '../components/CreateAuctionForm';

const CreateAuctionPage = ({ provider }) => {
  return (
    <div>
      <CreateAuctionForm provider={provider} />
    </div>
  );
};

export default CreateAuctionPage;
