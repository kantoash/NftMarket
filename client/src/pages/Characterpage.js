import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useGlobalState } from "../utils";
import NftCard from "../component/NftCard";

function Characterpage() {
  const [marketContract] = useGlobalState("marketContract");
  const [nftContract] = useGlobalState("nftContract");
  const [character, setCharacter] = useState({});
  const [items, setItems] = useState([]);
  const [boughtItems, setBoughtItems] = useState([]);
  const [loading, setLoading] = useState();
  const { id } = useParams();

  const CharacterLoad = async () => {
    // characterCount
    let avatar = await marketContract.getAvatar(id);

    let EditAvatars = {
      id: avatar.id,
      name: avatar.name,
      description: avatar.description,
      address: avatar.Address,
      image: avatar.image,
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

  useEffect(() => {
    setLoading(true);
    CharacterLoad();
    ItemsLoad();
    BoughtItem();
    setLoading(false);
  }, [marketContract, nftContract]);

  
  if (loading) {
    return (
      <h3 className=" bg-PrimaryDark h-screen w-screen overflow-x-hidden text-4xl animate-pulse p-10 text-blue-500">
        Loading...
      </h3>
    );
  }

  console.log(boughtItems);
  return  (
    <div className=" h-fit flex flex-col items-center space-y-9  pb-28  overflow-x-hidden">
      <div>
        <img
          src={`https://gateway.pinata.cloud/ipfs//${character?.image}`}
          className="h-80 w-full object-contain "
        />
      </div>
     <div className="flex flex-col items-center ">
     <h1 className="text-4xl tracking-wider pt-10">{character?.name}</h1>
     <h1 className="text-lg text-gray-700 ">{character?.description}</h1>
      <div className="text-gray-700 font-semibold text-xl pt-8">
        {character?.address}
      </div>
     </div>
    <div className="py-16 flex flex-col justify-center items-center max-w-6xl m-6 ">
    <h3 className="uppercase text-3xl text-gray-600 pb-4 ">Offered Nft</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8   ">
        {items.map((item,id) => (
          (item?.seller.toString() === character?.address.toString()) &&
          <NftCard item={item} key={id} />
        ))}
      </div>
      <h3 className="uppercase text-3xl text-gray-600 pt-12 pb-4">Bought Nft</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {boughtItems.map((item,id) => (
          (item?.buyer.toString() === character?.address.toString()) &&  <NftCard item={item} key={id} />
        ))}
      </div>
    </div>
    </div>
  );
}

export default Characterpage;
