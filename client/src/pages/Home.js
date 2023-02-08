import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { useGlobalState } from "../utils";
import NftCard from "../component/NftCard";
import AvatarRow from "../component/AvatarRow";

function Home() {
  const [marketContract] = useGlobalState("marketContract");
  const [nftContract] = useGlobalState("nftContract");
  const [Avatars, setAvatars] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const CharacterLoad = async () => {
      // characterCount
      const CharacterCount = await marketContract.getAvatarCount();
      let allAvatars = [];
      for (let idx = 1; idx <= CharacterCount; idx++) {
        const Avatar = await marketContract.getAvatar(idx);
        let item = {
          id: idx,
          address: Avatar?.Address,
          name: Avatar?.name,
          description: Avatar?.description,
          image: Avatar?.image,
        };
        allAvatars.push(item);
      }
      setAvatars(allAvatars);
    };
    CharacterLoad();
  }, []);

  useEffect(() => {
    const ItemsLoad = async () => {
      const ItemCount = await marketContract.getItemCount();
      let allItems = [];
      for (let idx = 1; idx <= ItemCount; idx++) {
        let Item = await marketContract.getItem(idx);
        const uri = await nftContract.tokenURI(Item.tokenId);
        const response = await fetch(uri);
        const meta = await response.json();
        let EditItem = {
          name: meta.name,
          description: meta.description,
          price: meta.price,
          image: meta.image,
          seller: Item.seller,
          sold: Item.sold,
          tokenId: Item.tokenId,
          itemId: Item.itemId
        }
        allItems.push(EditItem);
      }
      setItems(allItems);
      setLoading(false);
    }
    ItemsLoad();
  },[])


  if (loading) {
    return (
      <h3 className=" bg-PrimaryDark h-screen w-screen overflow-x-hidden text-4xl animate-pulse p-10 text-blue-500">
        Loading...
      </h3>
    );
  }
  
  return (
    <main className="flex flex-col items-center  space-y-14 bg-PrimaryDark pt-10 pb-28 overflow-x-hidden ">
      <div className="flex flex-col items-center justify-center space-y-4 py-6">
        <h1 className="text-2xl lg:text-5xl  text-white font-bold transition-all duration-700 ease-in-out ">
          Buy, sell, and showcase NFTs
        </h1>
        <h3 className=" text-lg text-white font-semibold">
          from Leading creators and brands
        </h3>
      </div>
      <div className={`h-2/3 max-w-6xl mx-auto p-5  `}>
        <Carousel
          autoPlay
          infiniteLoop
          showStatus={false}
          showIndicators={false}
          showThumbs={false}
          interval={5000}
          className=" CarsouelStyle rounded-xl"
        >
          <img
            className="object-contain h-full w-full rounded-xl"
            src="/images/slider/2.png"
          />
          <img
            className="object-contain h-full w-full rounded-xl"
            src="/images/slider/3.jpeg"
          />
          <img
            className="object-contain h-full w-full rounded-xl"
            src="/images/slider/4.jpg"
          />
        </Carousel>
      </div>
      <div className="mt-10">
        <AvatarRow Avatars={Avatars} key={Avatars.length} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-7 max-w-6xl  ">
        {items.map((item,id) => (
          <NftCard item={item} key={id} />
        ))}
      </div>
    </main>
  );
}

export default Home;