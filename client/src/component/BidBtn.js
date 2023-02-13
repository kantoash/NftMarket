import React, { useState } from "react";
import { useGlobalContext } from "../utils/Context";
import { ArrowRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ethers } from "ethers";

function BidBtn({ id }) {
  const { setBidItem } = useGlobalContext();
  return (
    <>
      <div
        className="cursor-pointer bg-green-500 rounded-full 
        px-4 py-2 uppercase text-white text-xl active:scale-105 duration-200 ease-in-out  text-center"
        onClick={() => setBidItem("scale-100")}
      >
        Bid
      </div>
      <BidTemplate id={id} />
    </>
  );
}

function BidTemplate({ id }) {
  const { BidItem, setBidItem, marketContract, setShowAlert } = useGlobalContext();
  const [bidAmt, setBidAmt] = useState("");

  const Bid = async () => {
    try {
      const BidTxn = await marketContract.bid(id, {
        value: ethers.utils.parseEther(bidAmt),
      });
      await BidTxn.wait();
      setShowAlert({
        status: true,
        message: `bid completed `,
      });
      setBidAmt("")
      setBidItem("scale-0")
    } catch (error) {
      setShowAlert({
        status: true,
        message: `bid error ${error?.reason?.slice(
          "execution reverted: ".length
        )}`,
      });
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex
    items-center justify-center bg-black bg-opacity-50 w ${BidItem} '`}
    >
      <div className="bg-PrimaryDark/90 CarsouelStyle rounded-xl md:w-3/4 lg:w-1/2 p-6 space-y-5">
        <div className="flex flex-row items-center justify-between pb-12 text-blue-400">
          <h1 className="text-3xl font-semibold  ">Bid</h1>
          <XMarkIcon
            onClick={() => setBidItem("scale-0")}
            className="h-8 p-1 rounded-full border-[1px] border-gray-600 cursor-pointer"
          />
        </div>
        <div className="CreateInputDiv ">
          <ArrowRightIcon className="h-5 text-white" />
          <input
            type="text"
            placeholder="Bid Amount"
            className="Createinput "
            onChange={(e) => setBidAmt(e.target.value)}
          />
        </div>

        <button
          onClick={Bid}
          className="py-3 px-5 w-full
            rounded-lg bg-blue-500 text-white font-semibold text-xl
             active:scale-105 transition-transform duration-300 ease-in-out"
        >
          Bid Now
        </button>
      </div>
    </div>
  );
}

export default BidBtn;
