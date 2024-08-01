import React from 'react';
import { useParams } from 'react-router-dom';
import AuctionDetails from '../components/AuctionDetails';

const AuctionDetailsPage = () => {
  const { auctionAddress } = useParams();

  return (
    <div>
      <AuctionDetails auctionAddress={auctionAddress} />
    </div>
  );
};

export default AuctionDetailsPage;
