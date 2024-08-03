// src/pages/NFTDetailPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import NFTDetail from '../components/NFTDetail';

const NFTDetailPage = ({ provider }) => {
  const { nftId } = useParams();

  return (
    <div>
      <NFTDetail provider={provider} nftId={nftId} />
    </div>
  );
};

export default NFTDetailPage;
