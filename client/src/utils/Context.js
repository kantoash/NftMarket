import React, { createContext, useContext, useState, useEffect } from "react";

const GlobalContext = createContext();
//  DonateProject: "scale-0",
//   BidItem: "scale-0",
export const GlobalContextProvider = ({ children }) => {
  const [connectedAccount, setConnectedAccount] = useState("");
  const [nftContract, setNftContract] = useState({});
  const [marketContract, setMarketContract] = useState({});
  const [DonateProject, setDonateProject] = useState("scale-0");
  const [BidItem, setBidItem] = useState("scale-0");
  const [showAlert, setShowAlert] = useState({
    status: false,
    message: "",
  });
  const truncate = (text, startChars, endChars, maxLength) => {
    if (text.length > maxLength) {
      let start = text.substring(0, startChars);
      let end = text.substring(text.length - endChars, text.length);
      while (start.length + end.length < maxLength) {
        start = start + ".";
      }
      return start + end;
    }
    return text;
  };

  const Marketplace = {
    abi: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_fee",
            type: "uint256",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "itemId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "address",
            name: "accepter",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "Bidder",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "BidAmount",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "timeStamp",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "accept",
            type: "bool",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "revoke",
            type: "bool",
          },
        ],
        name: "AcceptBidEvent",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "itemId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "address",
            name: "Bidder",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "BidAmount",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "timeStamp",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "accept",
            type: "bool",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "revoke",
            type: "bool",
          },
        ],
        name: "BidEvent",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "itemId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "nft",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "seller",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "buyer",
            type: "address",
          },
        ],
        name: "Bought",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "AvatarId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "address",
            name: "donater",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "timeStamp",
            type: "uint256",
          },
        ],
        name: "DonateEvent",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "itemId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "nft",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "address",
            name: "seller",
            type: "address",
          },
        ],
        name: "Offered",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "itemId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "address",
            name: "Bidder",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "BidAmount",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "timeStamp",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "revoke",
            type: "bool",
          },
        ],
        name: "RevokeBidEvent",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "AvatarExist",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "_AvatarName",
            type: "string",
          },
          {
            internalType: "string",
            name: "_description",
            type: "string",
          },
          {
            internalType: "string",
            name: "_AvatarImage",
            type: "string",
          },
        ],
        name: "CharacterMake",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "ItemId",
            type: "uint256",
          },
        ],
        name: "bid",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "ItemId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "BidId",
            type: "uint256",
          },
        ],
        name: "bidAccept",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "bids",
        outputs: [
          {
            internalType: "uint256",
            name: "itemId",
            type: "uint256",
          },
          {
            internalType: "address payable",
            name: "Bidder",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "BidAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timeStamp",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "accept",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "revoke",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "AvatarId",
            type: "uint256",
          },
        ],
        name: "donate",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_id",
            type: "uint256",
          },
        ],
        name: "getAvatar",
        outputs: [
          {
            components: [
              {
                internalType: "uint256",
                name: "id",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
              {
                internalType: "address payable",
                name: "Address",
                type: "address",
              },
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "description",
                type: "string",
              },
              {
                internalType: "string",
                name: "image",
                type: "string",
              },
            ],
            internalType: "struct Marketplace.Avatar",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getAvatarCount",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_address",
            type: "address",
          },
        ],
        name: "getAvatarExist",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getAvatars",
        outputs: [
          {
            components: [
              {
                internalType: "uint256",
                name: "id",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
              {
                internalType: "address payable",
                name: "Address",
                type: "address",
              },
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "description",
                type: "string",
              },
              {
                internalType: "string",
                name: "image",
                type: "string",
              },
            ],
            internalType: "struct Marketplace.Avatar[]",
            name: "",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_ItemId",
            type: "uint256",
          },
        ],
        name: "getBid",
        outputs: [
          {
            components: [
              {
                internalType: "uint256",
                name: "itemId",
                type: "uint256",
              },
              {
                internalType: "address payable",
                name: "Bidder",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "BidAmount",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "timeStamp",
                type: "uint256",
              },
              {
                internalType: "bool",
                name: "accept",
                type: "bool",
              },
              {
                internalType: "bool",
                name: "revoke",
                type: "bool",
              },
            ],
            internalType: "struct Marketplace.Bid[]",
            name: "",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getFee",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_id",
            type: "uint256",
          },
        ],
        name: "getItem",
        outputs: [
          {
            components: [
              {
                internalType: "uint256",
                name: "itemId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "nftAddress",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "price",
                type: "uint256",
              },
              {
                internalType: "address payable",
                name: "seller",
                type: "address",
              },
              {
                internalType: "bool",
                name: "sold",
                type: "bool",
              },
            ],
            internalType: "struct Marketplace.Item",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getItemCount",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getItems",
        outputs: [
          {
            components: [
              {
                internalType: "uint256",
                name: "itemId",
                type: "uint256",
              },
              {
                internalType: "address",
                name: "nftAddress",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "price",
                type: "uint256",
              },
              {
                internalType: "address payable",
                name: "seller",
                type: "address",
              },
              {
                internalType: "bool",
                name: "sold",
                type: "bool",
              },
            ],
            internalType: "struct Marketplace.Item[]",
            name: "",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_nft",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_tokenId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_price",
            type: "uint256",
          },
        ],
        name: "makeItem",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_itemId",
            type: "uint256",
          },
        ],
        name: "purchaseItem",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "ItemId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "BidId",
            type: "uint256",
          },
        ],
        name: "revoke",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
  };
  const NFT = {
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "_marketPlace",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "approved",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "ApprovalForAll",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "getApproved",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
        ],
        name: "isApprovedForAll",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "_tokenURI",
            type: "string",
          },
        ],
        name: "mint",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "ownerOf",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "operator",
            type: "address",
          },
          {
            internalType: "bool",
            name: "approved",
            type: "bool",
          },
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes4",
            name: "interfaceId",
            type: "bytes4",
          },
        ],
        name: "supportsInterface",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "tokenCount",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "tokenURI",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
  };

  useEffect(() => {
    if (showAlert?.status) {
      const timer = setTimeout(() => {
        setShowAlert({ status: false, message: "" });
      }, [5000]);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <GlobalContext.Provider
      value={{
        truncate,
        NFT,
        Marketplace,
        connectedAccount,
        setConnectedAccount,
        nftContract,
        setNftContract,
        marketContract,
        setMarketContract,
        DonateProject,
        setDonateProject,
        BidItem,
        setBidItem,
        showAlert, setShowAlert
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
