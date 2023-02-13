import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGlobalContext } from "../utils/Context";
import { DonateBtn, NftCard } from "../component";
import { ethers } from "ethers";
import Moment from "react-moment";

function Characterpage() {
  const { nftContract, marketContract, truncate } = useGlobalContext();
  const [character, setCharacter] = useState({});
  const [items, setItems] = useState([]);
  const [boughtItems, setBoughtItems] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState();
  const navigate = useNavigate();
  const { id } = useParams();

  const CharacterLoad = async () => {
    // characterCount
    let avatar = await marketContract.getAvatar(id);

    let EditAvatars = {
      id: avatar.id,
      name: avatar.name,
      description: avatar.description,
      address: avatar.Address,
      image: avatar.image.substring(6),
    };
    setCharacter(EditAvatars);
  };

  const ItemsLoad = async () => {
    const allItems = await marketContract.getItems();
    let Items = await Promise.all(
      allItems.map(async (item) => {
        {
          const uri = await nftContract.tokenURI(item.tokenId);
          const response = await fetch(uri);
          const meta = await response.json();

          let temp = {
            name: meta.name,
            description: meta.description,
            price: meta.price,
            image: meta.image,
            seller: item.seller,
            sold: item.sold,
            tokenId: item.tokenId,
            itemId: item.itemId,
          };

          return temp;
        }
      })
    );
    setItems(Items);
  };

  const BoughtItem = async () => {
    const filter = marketContract.filters.Bought();
    const result = await marketContract.queryFilter(filter);
    const purchases = await Promise.all(
      result.map(async (item) => {
        let temp = item.args;
        const uri = await nftContract.tokenURI(temp?.tokenId);
        const response = await fetch(uri);
        const metadata = await response.json();
        let purchaseItem = {};
        {
          purchaseItem = {
            name: metadata?.name,
            description: metadata?.description,
            price: metadata?.price,
            image: metadata?.image,
            sold: true,
            buyer: temp?.buyer,
            itemId: temp?.itemId,
            seller: temp?.seller,
            tokenId: temp?.tokenId,
          };
        }
        return purchaseItem;
      })
    );
    setBoughtItems(purchases);
  };

  const LoadsBidEvent = async () => {
    const PlaceBids = marketContract.filters.BidEvent();
    const AcceptBids = marketContract.filters.AcceptBidEvent();
    const RevokeBids = marketContract.filters.RevokeBidEvent();

    let result = [];
    const placebids = await marketContract.queryFilter(PlaceBids);
    const acceptbids = await marketContract.queryFilter(AcceptBids);
    const revokebids = await marketContract.queryFilter(RevokeBids);
    result.push(...placebids, ...acceptbids, ...revokebids);

    const allBids = await Promise.all(
      result.map(async (bid) => {
        let temp = bid.args;
        const Item = await marketContract.getItem(temp?.itemId);
        const uri = await nftContract.tokenURI(Item?.tokenId);
        const response = await fetch(uri);
        const metadata = await response.json();

        let status = "";
        if (temp?.accept) {
          status = "accept";
        } else if (temp?.revoke) {
          status = "revoke";
        } else {
          status = "placeBid";
        }

        let Editbid = {
          name: metadata?.name,
          description: metadata?.description,
          price: metadata?.price,
          image: metadata?.image.substring(6),
          itemId: temp?.itemId,
          BidAmount: ethers.utils.formatEther(temp?.BidAmount),
          Bidder: temp?.Bidder,
          timestamp: temp?.timeStamp,
          status: status,
        };

        return Editbid;
      })
    );
    setBids(allBids);
  };

  useEffect(() => {
    setLoading(true);
    const loadCharacterpage = async () => {
      await CharacterLoad();
      await ItemsLoad();
      await BoughtItem();
      await LoadsBidEvent();
    };
    loadCharacterpage();
    setLoading(false);
  }, [marketContract, nftContract]);

  if (loading) {
    return (
      <h3 className=" bg-PrimaryDark h-screen w-screen overflow-x-hidden text-4xl animate-pulse p-10 text-blue-500">
        Loading...
      </h3>
    );
  }

  console.log(items);

  return (
    <div className=" h-full flex flex-col items-center space-y-9  pb-28  overflow-x-hidden">
      <div>
        <img
          src={`https://gateway.pinata.cloud/ipfs//${character?.image}`}
          className="h-80 w-full object-contain "
        />
      </div>
      <div className="flex flex-col items-center  ">
        <h1 className="text-4xl tracking-wider pt-10">{character?.name}</h1>
        <h1 className="text-lg text-gray-700 pb-4">{character?.description}</h1>
        <DonateBtn id={id} key={id} />
        <div className="text-gray-700 font-semibold text-xl pt-8">
          {character?.address}
        </div>
      </div>
      <div>
        {bids.map(
          (bid, id) =>
            bid?.Bidder.toString() === character?.address.toString() && (
              <div
                onClick={() => navigate(`/NftPage/${bid?.itemId}/${bid?.name}`)}
                className={`flex flex-row space-x-5 items-center justify-between m-2 p-1.5 rounded-lg  cursor-pointer ${
                  bid?.status === "accept"
                    ? "bg-blue-300"
                    : bid?.status === "revoke"
                    ? "bg-red-300"
                    : "bg-green-300"
                } `}
              >
                <div>
                  <img
                    src={`https://gateway.pinata.cloud/ipfs//${bid?.image}`}
                    className="h-16 w-20 object-fill rounded-lg"
                  />
                </div>
                <div
                  className={`text-lg text-gray-700 flex flex-row space-x-8 items-center justify-between `}
                >
                  <h4>
                    <Moment fromNow>{bid?.timestamp}</Moment>
                  </h4>
                  <h3>{truncate(bid?.Bidder, 4, 4, 11)}</h3>
                  <h3>{bid?.BidAmount} Eth</h3>
                </div>
              </div>
            )
        )}
      </div>

      <div className="py-16 flex flex-col justify-center items-center max-w-6xl m-6 ">
        <h3 className="uppercase text-3xl text-gray-600 pb-4 ">Offered Nft</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8   ">
          {items.map(
            (item, id) =>
              item?.seller.toString() === character?.address.toString() && (
                <NftCard item={item} key={id} />
              )
          )}
        </div>
        <h3 className="uppercase text-3xl text-gray-600 pt-12 pb-4">
          Bought Nft
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {boughtItems.map(
            (item, id) =>
              item?.buyer.toString() === character?.address.toString() && (
                <NftCard item={item} key={id} />
              )
          )}
        </div>
      </div>
    </div>
  );
}

export default Characterpage;
