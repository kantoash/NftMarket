// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    // Variables
    address payable owner; // the account that receives fees
    uint public fee; // the fee percentage on sales
    uint public itemCount;
    uint public AvatarCount;

    mapping(uint => Item) public items;
    mapping(uint => Avatar) public AvatarList;
    mapping(address => bool) public AvatarExist;

    struct Avatar {
        address Address;
        string name;
        string description;
        string image;
    }

    struct Item {
        uint itemId;
        address nftAddress;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
    }

    // offered in market for sell
    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );

    // bought item from market
    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    function getFee() public view returns (uint) {
        return fee;
    }

    function getItemCount() public view returns (uint) {
        return itemCount;
    }

    function getAvatarCount() public view returns (uint) {
        return AvatarCount;
    }

    function getItem(uint _id) public view returns (Item memory) {
        return items[_id];
    }

    function getAvatar(uint _id) public view returns (Avatar memory) {
        return AvatarList[_id];
    }

    function getAvatarExist(address _address) public view returns (bool) {
        return AvatarExist[_address];
    }

    constructor(uint _fee) {
        owner = payable(msg.sender);
        fee = _fee;
    }

    function CharacterMake(
        string memory _AvatarName,
        string memory _description,
        string memory _AvatarImage
    ) public {
        AvatarCount++;
        Avatar storage avatar = AvatarList[AvatarCount];
        AvatarExist[msg.sender] = true;
        avatar.Address = msg.sender;
        avatar.name = _AvatarName;
        avatar.description = _description;
        avatar.image = _AvatarImage;
    }

    // Make item to offer on the marketplace
    function makeItem(
        address _nft,
        uint _tokenId,
        uint _price
    ) external payable nonReentrant {
        require(msg.value >= fee, "Need to pay Fee");
        require(_price > 0, "Price must be greater than zero");
        require(AvatarExist[msg.sender], "make sure create an avatar");
        // increment itemCount
        itemCount++;

        // transfer nft
        IERC721(_nft).transferFrom(msg.sender, address(this), _tokenId);

        // add new item to items mapping
        Item storage nftitem = items[itemCount];
        nftitem.itemId = itemCount;
        nftitem.nftAddress = _nft;
        nftitem.tokenId = _tokenId;
        nftitem.price = _price;
        nftitem.seller = payable(msg.sender);
        nftitem.sold = false;

        // emit Offered event
        emit Offered(itemCount, _nft, _tokenId, _price, msg.sender);

        payTo(owner, msg.value);
    }

    function purchaseItem(uint _itemId) external payable nonReentrant {
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(
            msg.value >= item.price,
            "not enough ether to cover item price and market fee"
        );
        require(!item.sold, "item already sold");

        // update item to sold
        item.sold = true;

        // pay seller and feeAccount
        payTo(item.seller, item.price);

        // transfer nft to buyer
        IERC721(item.nftAddress).transferFrom(
            address(this),
            msg.sender,
            item.tokenId
        );

        // emit Bought event
        emit Bought(
            _itemId,
            item.nftAddress,
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
    }

    function payTo(address _owner, uint _amt) internal {
        (bool send, ) = payable(_owner).call{value: _amt}("");
        require(send);
    }
}
