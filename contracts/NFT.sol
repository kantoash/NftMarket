// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    uint public tokenCount;
    address marketPlace;

    constructor(address _marketPlace) ERC721("MNFT", "MDAPP") {
        marketPlace = _marketPlace;
    }

    function mint(string memory _tokenURI) external returns (uint) {
        tokenCount++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        setApprovalForAll(marketPlace, true);
        return (tokenCount);
    }
}
