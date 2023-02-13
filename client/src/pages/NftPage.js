import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import BidBtn from "../component/BidBtn";
import Moment from "react-moment";
import { useGlobalContext } from "../utils/Context";

function NftPage() {
  const { itemId } = useParams();
  const {
    nftContract,
    marketContract,
    truncate,
    connectedAccount,
    setShowAlert,
  } = useGlobalContext();
  const [nftItem, setNftItem] = useState({});
  const [loading, setLoading] = useState();
  const [bids, setBids] = useState([]);
  const navigate = useNavigate();

  const loadItem = async () => {
    const Item = await marketContract.getItem(itemId);
    const uri = await nftContract.tokenURI(Item?.tokenId);
    const response = await fetch(uri);
    const meta = await response.json();

    let EditItem = {
      name: meta.name,
      description: meta.description,
      price: meta.price,
      image: meta.image.substring(6),
      seller: Item.seller,
      sold: Item.sold, //
      tokenId: Item.tokenId,
      itemId: Item.itemId,
    };
    setNftItem(EditItem);
  };

  const loadBids = async () => {
    let allBids = await marketContract.getBid(itemId);
    let bids = await Promise.all(
      allBids.map((bid, id) => {
        let EditBid = {
          bidId: id,
          BidAmount: ethers.utils.formatEther(bid.BidAmount),
          Bidder: bid.Bidder,
          accept: bid.accept,
          itemId: bid.itemId,
          revoke: bid.revoke,
          timeStamp: bid.timeStamp,
        };
        return EditBid;
      })
    );
    setBids(bids);
  };

  const nftPageLoad = async () => {
    await loadItem();
    await loadBids();
  };

  useEffect(() => {
    setLoading(true);
    nftPageLoad();
    setLoading(false);
  }, [marketContract]);

  const BuyNow = async () => {
    try {
      const BuyTxn = await marketContract.purchaseItem(itemId, {
        value: ethers.utils.parseEther(nftItem.price),
      });
      setShowAlert({
        status: true,
        message: `nft Purchase in process... `,
      });
      await BuyTxn.wait();
      navigate("/");
    } catch (error) {
      setShowAlert({
        status: true,
        message: `nft Purchase error: ${error?.reason?.slice(
          "execution reverted: ".length
        )} `,
      });
    }
  };

  const revoke = async (bidId) => {
    try {
      const RevokeTxn = await marketContract.revoke(itemId, bidId);
      await RevokeTxn.wait();
      setShowAlert({
        status: true,
        message: `bid revoke completed `,
      });
    } catch (error) {
      setShowAlert({
        status: true,
        message: `bid revoke error ${error?.reason?.slice(
          "execution reverted: ".length
        )}`,
      });
    }
  };

  const accept = async (bidId) => {
    try {
      const acceptTxn = await marketContract.bidAccept(itemId, bidId);
      await acceptTxn.wait();
      setShowAlert({
        status: true,
        message: `bid accept completed `,
      });
      navigate("/");
    } catch (error) {
      setShowAlert({
        status: true,
        message: `bid accept error ${error?.reason?.slice(
          "execution reverted: ".length
        )} `,
      });
    }
  };

  if (loading) {
    return (
      <h3 className=" bg-PrimaryDark h-screen w-screen overflow-x-hidden text-4xl animate-pulse p-10 text-blue-500">
        Loading...
      </h3>
    );
  }

  return (
    <div className="h-screen max-w-7xl mx-auto flex flex-col md:flex-row space-x-4 space-y-7 items-center justify-center pb-20 ">
      <div>
        <img
          src={`https://gateway.pinata.cloud/ipfs//${nftItem?.image}`}
          className="h-[400px] w-[400px] object-fill rounded-md   "
        />
      </div>
      <div>
        {/* info */}
        <div className="text-gray-700 flex flex-col justify-center space-y-4 ">
          <section className="space-y-0.5 pb-8">
            <h1 className="text-4xl ">{nftItem?.name}</h1>
            <p className="text-lg ">{nftItem?.description}</p>
          </section>
          {/* selller */}
          <div className="flex flex-col space-y-2 justify-center w-full p-1.5 ">
            <section className="flex flex-row items-center justify-between space-x-5 ">
              <h3 className="text-xl text-gray-700 pb-0.5">Seller: </h3>
              <h3 className="p-1 border-[1px] rounded-full text-sm  border-gray-500 ">
                {nftItem?.seller}
              </h3>
            </section>
            {/* status */}
            <section className="flex flex-row items-center justify-between ">
              <h3 className="text-xl text-gray-700  pb-0.5">Status:</h3>
              <div className="text-lg">
                {!nftItem?.sold ? (
                  <span className="font-normal bg-green-500 p-2 rounded-full text-white">
                    For sale
                  </span>
                ) : (
                  <span className="font-normal bg-red-500 p-2 rounded-full text-white">
                    Sold
                  </span>
                )}
              </div>
            </section>
            {/* Price */}
            <section className="flex flex-row items-center justify-between text-gray-700">
              <h3 className="text-2xl pb-0.5">Price: </h3>
              <h3 className="text-xl">{nftItem?.price} ETH</h3>
            </section>
          </div>
          <button
            onClick={BuyNow}
            className="bg-blue-500 py-2 px-4 rounded-full m-4 text-white font-base text-2xl active:scale-105 duration-200 transition-transform "
          >
            Buy Now
          </button>
        </div>

        {/* bidding */}
        <div className="flex flex-col justify-between pt-6 p-4 space-y-5 ">
          <div className="space-y-2 ">
            {bids.map((bid, id) => (
              !bid?.revoke && <div
                className={`flex flex-row items-center justify-between py-2 px-3  rounded-full text-gray-700 font-medium bg-gray-300 space-x-5 `}
              >
                <h4 className="text-sm">
                  <Moment fromNow>{bid?.timeStamp}</Moment>
                </h4>
                <h3>{truncate(bid?.Bidder, 4, 4, 11)}</h3>
                <h3>{bid?.BidAmount} ETH</h3>
                <div className="flex flex-row items-center space-x-2">
                  <button
                    onClick={() => {
                      accept(bid?.bidId);
                    }}
                    className="p-2 py-1.5 bg-blue-300
                     rounded-full  capitalize "
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => {
                      revoke(bid?.bidId);
                    }}
                    className="p-2 bg-red-300
                     rounded-full  capitalize cursor-pointer "
                  >
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
          {<BidBtn id={itemId} key={itemId} />}
        </div>
      </div>
    </div>
  );
}

export default NftPage;
