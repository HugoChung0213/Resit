import React from 'react';
import MyNFTList from '../components/MyNFTList';

const MyNFTListPage = ({ provider }) => {
  return (
    <div>
      <MyNFTList provider={provider} />
    </div>
  );
};

export default MyNFTListPage;
