import React, { useState } from "react";
import { useGlobalState, setGlobalState } from "../utils";
import { ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { ethers } from "ethers";

function DonateBtn({ id }) {
  return (
    <>
      <div
        className="cursor-pointer bg-green-500 rounded-full 
        px-4 py-2 uppercase text-white text-xl active:scale-105 duration-200 ease-in-out
         w-1/5 text-center"
        onClick={() => setGlobalState("DonateProject", "scale-100")}
      >
        Donate
      </div>
      <DonateTemplate id={id} />
    </>
  );
}

function DonateTemplate({ id }) {
  const [marketContract] = useGlobalState('marketContract');
  const [DonateProject] = useGlobalState("DonateProject");
  const [donateAmt, setDonateAmt] = useState("");


  const Donate = async () => {
   try {
    const DonateTxn = 
    await marketContract.donate(id, {value: ethers.utils.parseUnits(donateAmt.toString(),"ether")})
    await DonateTxn.wait()
    console.log("successfully donate amount",DonateTxn)
    setGlobalState('DonateProject', 'scale-0')
   } catch (error) {
    console.log("donate amt error", error)
   }
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex
    items-center justify-center bg-black bg-opacity-50 w ${DonateProject} '`} 
    >
      <div className="bg-PrimaryDark/90 CarsouelStyle rounded-xl md:w-3/4 lg:w-1/2 p-6 space-y-5">
        <div className="flex flex-row items-center justify-between pb-12 text-blue-400">
          <h1 className="text-3xl font-semibold  ">Donate</h1>
          <XMarkIcon onClick={() => setGlobalState('DonateProject', 'scale-0')} className="h-8 p-1 rounded-full border-[1px] border-gray-600 cursor-pointer" />
        </div>

        <div className="CreateInputDiv ">
          <ArrowRightIcon className="h-5 text-white" />
          <input
            type="text"
            placeholder="Donate"
            className="Createinput "
            onChange={(e) => setDonateAmt(e.target.value)}
          />
        </div>

          <button onClick={Donate} className="py-3 px-5 w-full
            rounded-lg bg-blue-500 text-white font-semibold text-xl
             active:scale-105 transition-transform duration-300 ease-in-out">
            Donate Now
          </button>
      </div>
    </div>
  );
}

export default DonateBtn;
