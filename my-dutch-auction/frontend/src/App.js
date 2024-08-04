import React, { useState, useEffect } from 'react';
import { BrowserProvider, InfuraProvider } from 'ethers';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateNFTPage from './pages/CreateNFTPage';
import CreateAuctionPage from './pages/CreateAuctionPage';
import AuctionListPage from './pages/AuctionListPage';
import MyNFTListPage from './pages/MyNFTListPage';
import AuctionDetailsPage from './pages/AuctionDetailsPage';
import NFTDetailPage from './pages/NFTDetailPage';
import CompletedAuctionDetailsPage from './pages/CompletedAuctionDetailsPage';
import './App.css';

const App = () => {
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      const infuraProjectId = process.env.REACT_APP_INFURA_PROJECT_ID;
      const networkName = process.env.REACT_APP_NETWORK_NAME;

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
      } else if (infuraProjectId && networkName) {
        const infuraProvider = new InfuraProvider(networkName, infuraProjectId);
        setProvider(infuraProvider);
      } else {
        console.error("No Ethereum provider found and Infura settings are not configured");
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
          <Route path="/auction/:auctionAddress" element={<AuctionDetailsPage provider={provider} />} />
          <Route path="/nft/:nftId" element={<NFTDetailPage provider={provider} />} />
          <Route path="/completed-auction/:auctionAddress" element={<CompletedAuctionDetailsPage provider={provider} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
