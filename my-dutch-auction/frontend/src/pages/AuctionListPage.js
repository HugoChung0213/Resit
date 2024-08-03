import React from 'react';
import AuctionList from '../components/AuctionList';
import { useNavigate } from 'react-router-dom';

const AuctionListPage = ({ provider }) => {
  const navigate = useNavigate();

  const handleSelectAuction = (auctionAddress) => {
    navigate(`/auction-details/${auctionAddress}`);
  };

  return (
    <div>
      <AuctionList provider={provider} onSelectAuction={handleSelectAuction} />
    </div>
  );
};

export default AuctionListPage;
