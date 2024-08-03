// src/pages/CompletedAuctionDetailsPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import CompletedAuctionDetails from '../components/CompletedAuctionDetails';

const CompletedAuctionDetailsPage = () => {
  const { auctionAddress } = useParams();

  return (
    <div>
      <CompletedAuctionDetails auctionAddress={auctionAddress} />
    </div>
  );
};

export default CompletedAuctionDetailsPage;
