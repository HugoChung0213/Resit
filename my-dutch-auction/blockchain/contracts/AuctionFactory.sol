// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./DutchAuction.sol";

contract AuctionFactory {
    DutchAuction[] public auctions;

    event AuctionCreated(address indexed auctionContract);

    function createAuction(
        uint _startingPrice,
        uint _discountRate,
        address _nft,
        uint _nftId
    ) external {
        DutchAuction newAuction = new DutchAuction(
            msg.sender, // 传递调用者的地址
            _startingPrice,
            _discountRate,
            _nft,
            _nftId

        );
        auctions.push(newAuction);
        emit AuctionCreated(address(newAuction));
    }

    function getAuctions() external view returns (DutchAuction[] memory) {
        return auctions;
    }
}
