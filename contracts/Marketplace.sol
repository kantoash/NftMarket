// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    // Variables
    address payable owner; // the account that receives fees
    uint fee; // the fee percentage on sales
    uint itemCount;
    uint AvatarCount;

    Item[] Items;
    Avatar[] Avatars;

    mapping(uint => Bid[]) public bids; // itemId => Bid[]
    mapping(address => bool) public AvatarExist;

    // bid function
    // donate function

    struct Avatar {
        uint id;
        uint amount;
        address payable Address;
        string name;
        string description;
        string image;
    }

    struct Bid {
        uint itemId;
        address payable Bidder;
        uint BidAmount;
        uint timeStamp;
        bool accept;
        bool revoke;
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

    event BidEvent(
        uint itemId,
        address Bidder,
        uint BidAmount,
        uint timeStamp,
        bool accept,
        bool revoke
    );

    event AcceptBidEvent(
        uint itemId,
        address accepter,
        address Bidder,
        uint BidAmount,
        uint timeStamp,
        bool accept,
        bool revoke
    );

    event RevokeBidEvent(
        uint itemId,
        address Bidder,
        uint BidAmount,
        uint timeStamp,
        bool revoke
    );
    event DonateEvent(
        uint AvatarId,
        address donater,
        uint amount,
        uint timeStamp
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

    function getItems() public view returns (Item[] memory) {
        return Items;
    }

    function getItem(uint _id) public view returns (Item memory) {
        return Items[_id];
    }

    function getAvatars() public view returns (Avatar[] memory) {
        return Avatars;
    }

    function getAvatar(uint _id) public view returns (Avatar memory) {
        return Avatars[_id];
    }

    function getBid(uint _ItemId) public view returns(Bid[] memory){
        return bids[_ItemId];
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
        require(!AvatarExist[msg.sender], "Already Avatar Exist");
        Avatar memory avatar;
        AvatarExist[msg.sender] = true;
        avatar.id = AvatarCount;
        avatar.Address = payable(msg.sender);
        avatar.name = _AvatarName;
        avatar.description = _description;
        avatar.image = _AvatarImage;
        Avatars.push(avatar);
        AvatarCount++;
    }

    function donate(uint AvatarId) public payable {
        Avatar storage avatar = Avatars[AvatarId];
        require(avatar.id >= 0, "Not present");
        require(msg.value > 0, "Donate valid amt");
        require(msg.sender != avatar.Address, "Not owner can donate itself");

        avatar.amount += msg.value;

        emit DonateEvent(AvatarId, msg.sender, msg.value, block.timestamp);

        payTo(avatar.Address, msg.value);
    }

    // Make item to offer on the marketplace
    function makeItem(
        address _nft,
        uint _tokenId,
        uint _price
    ) external payable nonReentrant {
        require(msg.value >= fee, "Need to pay Fee");
        require(_price > 0, "Price must be greater than zero");

        // add new item to items mapping
        Item memory nftitem;
        nftitem.itemId = itemCount;
        nftitem.nftAddress = _nft;
        nftitem.tokenId = _tokenId;
        nftitem.price = _price;
        nftitem.seller = payable(msg.sender);
        nftitem.sold = false;

        Items.push(nftitem);

        // increment itemCount
        itemCount++;

        // transfer nft
        IERC721(_nft).transferFrom(msg.sender, address(this), _tokenId);

        // emit Offered event
        emit Offered(itemCount, _nft, _tokenId, _price, msg.sender);

        payTo(owner, msg.value);
    }

    function purchaseItem(uint _itemId) external payable nonReentrant {
        Item storage item = Items[_itemId];
        require(_itemId >= 0 && _itemId <= itemCount, "item doesn't exist");
        require(
            msg.value >= item.price,
            "not enough ether to cover item price and market fee"
        );
        require(!item.sold, "item already sold");

        // update item to sold
        item.sold = true;
        rePayBid(_itemId);
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

    function rePayBid(uint ItemId) internal {
        if (bids[ItemId].length > 0) {
            for (uint i = 0; i < bids[ItemId].length; i++) {
                Bid memory CurrBid = bids[ItemId][i];
                if (!CurrBid.accept) {
                    payTo(CurrBid.Bidder, CurrBid.BidAmount);
                }
            }
        }
    }

    function bid(uint ItemId) public payable {
        require(ItemId >= 0 && ItemId <= itemCount, "item doesn't exist");
        require(msg.value > 0, "BidAmt must be valid");

        Bid memory tempbid;

        tempbid.itemId = ItemId;
        tempbid.Bidder = payable(msg.sender);
        tempbid.BidAmount += msg.value;
        tempbid.timeStamp = block.timestamp;
        tempbid.accept = false;
        tempbid.revoke = false;

        bids[ItemId].push(tempbid);

        emit BidEvent(ItemId, msg.sender, msg.value, block.timestamp, false, false);
    }

    function revoke(uint ItemId, uint BidId) public {
        Bid storage tempBid = bids[ItemId][BidId];
        require(ItemId >= 0 && ItemId <= itemCount, "item doesn't exist");
        require(msg.sender == tempBid.Bidder , "Only bidder");
        require(!tempBid.accept, "Only not accepted");
        
        tempBid.revoke = true;

        emit RevokeBidEvent(
            ItemId,
            msg.sender,
            tempBid.BidAmount,
            block.timestamp,
            true
        );

        payTo(tempBid.Bidder, tempBid.BidAmount);
    }

    function bidAccept(uint ItemId, uint BidId) public payable {
        Bid storage tempBid = bids[ItemId][BidId];
         Item storage item = Items[ItemId];

        require(ItemId >= 0 && ItemId <= itemCount, "item doesn't exist");
        require(msg.sender == item.seller, "Only seller");
        require(!tempBid.revoke, "Not revoke is important");

        tempBid.accept = true;

        item.sold = true;
        rePayBid(ItemId);
        // transfer nft to buyer
        IERC721(item.nftAddress).transferFrom(
            address(this),
            msg.sender,
            item.tokenId
        );

        emit AcceptBidEvent(
            ItemId,
            msg.sender,
            tempBid.Bidder,
            tempBid.BidAmount,
            block.timestamp,
            true,
            false
        );

        // emit Bought event
        emit Bought(
            ItemId,
            item.nftAddress,
            item.tokenId,
            item.price,
            msg.sender,
            tempBid.Bidder
        );

        payTo(msg.sender, tempBid.BidAmount);
    }

    function payTo(address _owner, uint _amt) internal {
        (bool send, ) = payable(_owner).call{value: _amt}("");
        require(send);
    }
}
