import React from 'react';
import AuctionList from '../components/AuctionList';

const AuctionListPage = ({ provider }) => {
  return (
    <div>
      <h2>Auction List</h2>
      <AuctionList provider={provider} />
    </div>
  );
};

export default AuctionListPage;
