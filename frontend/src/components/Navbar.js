import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/create-nft">Create NFT</Link></li>
        <li><Link to="/create-auction">Create Auction</Link></li>
        <li><Link to="/auction-list">Auction List</Link></li>
        <li><Link to="/my-nft-list">My NFT List</Link></li> 
      </ul>
    </nav>
  );
};

export default Navbar;
