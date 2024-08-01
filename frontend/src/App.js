import React, { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateNFTPage from './pages/CreateNFTPage';
import CreateAuctionPage from './pages/CreateAuctionPage';
import AuctionListPage from './pages/AuctionListPage';
import MyNFTListPage from './pages/MyNFTListPage';
import AuctionDetailsPage from './pages/AuctionDetailsPage'; // 新增导入
import './App.css';

const App = () => {
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      if (window.ethereum) {
        try {
          const tempProvider = new BrowserProvider(window.ethereum);
          setProvider(tempProvider);

          const existingAccounts = await tempProvider.send('eth_accounts', []);
          if (existingAccounts.length === 0) {
            await tempProvider.send('eth_requestAccounts', []);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    loadProvider();
  }, []);

  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-nft" element={<CreateNFTPage provider={provider} />} />
          <Route path="/create-auction" element={<CreateAuctionPage provider={provider} />} />
          <Route path="/auction-list" element={<AuctionListPage provider={provider} />} />
          <Route path="/my-nft-list" element={<MyNFTListPage provider={provider} />} />
          <Route path="/auction/:auctionAddress" element={<AuctionDetailsPage />} /> {/* 修改路由 */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
