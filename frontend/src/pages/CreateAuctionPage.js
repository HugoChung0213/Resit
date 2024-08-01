import React from 'react';
import CreateAuctionForm from '../components/CreateAuctionForm';

const CreateAuctionPage = ({ provider }) => {
  return (
    <div>
      <h2>Create Auction</h2>
      <CreateAuctionForm provider={provider} />
    </div>
  );
};

export default CreateAuctionPage;
