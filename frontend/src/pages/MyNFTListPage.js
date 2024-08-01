import React from 'react';
import MyNFTList from '../components/MyNFTList';

const MyNFTListPage = ({ provider }) => {
  return (
    <div>
      <h2>My NFTs</h2>
      <MyNFTList provider={provider} />
    </div>
  );
};

export default MyNFTListPage;
