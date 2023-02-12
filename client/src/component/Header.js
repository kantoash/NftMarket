import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { setGlobalState, truncate, useGlobalState } from "../utils";

function Header() {
  const [connectedAccount] = useGlobalState("connectedAccount");
  const [magnifyingOpen, setMagnifyingOpen] = useState(false);
  const [burgerMenu, setBurgerMenu] = useState(false);
  const navigate = useNavigate();

  const Connect = async () => {
    try {
      if (!window.ethereum) {
        return console.log("plaese install metawallet");
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setGlobalState("connectedAccount", accounts[0]?.toLowerCase());
    } catch (error) {
      console.log("wallet connect error", error);
    }
  };

  return (
    <header className="bg-PrimaryDark sticky py-3 px-4 z-50 top-0 text-white justify-between items-center flex flex-row space-x-5 overflow-x-hidden">
      {/* left */}
      <div className="flex flex-row items-center space-x-2 ">
        <div onClick={() => setBurgerMenu(!burgerMenu)}>
          {burgerMenu ? (
            <XCircleIcon className="h-10 text-white " />
          ) : (
            <Bars3Icon className="h-10 text-white" />
          )}
          {burgerMenu && (
            <motion.div
              initial={{
                x: -300,
                opacity: 0,
              }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              transition={{
                duration: 1,
              }}
              className="w-screen h-screen text-white"
            >
              <div className="pt-10 flex flex-col justify-center space-y-6 text-2xl">
                <div
                  onClick={() => {
                    navigate("/Create");
                  }}
                  className="cursor-pointer"
                >
                  Create
                </div>
                <div
                  onClick={() => {
                    navigate("/Character");
                  }}
                  className="cursor-pointer"
                >
                  Character
                </div>
              </div>
            </motion.div>
          )}
        </div>
        <img
          onClick={() => {
            navigate("/");
          }}
          src="/images/cryptoLogo.png"
          alt="logo"
          className="h-10 flex-shrink-0 cursor-pointer "
        />
        <h3 className="text-3xl font-bold border-l-[1px] border-white px-4 ">
          NFT
        </h3>
        <div className="flex-row items-center space-x-2 bg-white p-1 rounded-xl hidden lg:inline-flex  ">
          <MagnifyingGlassIcon className="h-8 text-blue-500  pl-3 " />
          <input
            className="px-1 placeholder:text-gray-600 placeholder:font-semibold outline-none text-gray-700 w-[350px] rounded-xl "
            placeholder="Search Collectibles and Collections"
          />
        </div>
      </div>

      {magnifyingOpen && (
        <div className="flex flex-row items-center flex-grow bg-white p-1 rounded-xl lg:hidden">
          <MagnifyingGlassIcon className="h-8 w-8 text-blue-500" />
          <input
            className=" flex-1 px-5 placeholder:text-gray-600 placeholder:font-semibold outline-none text-gray-700 "
            placeholder="Search Collectibles and Collections"
          />
        </div>
      )}

      {/* right */}
      <div className="flex flex-row items-center justify-center space-x-3 font-[500]">
        <MagnifyingGlassIcon
          onClick={() => setMagnifyingOpen(!magnifyingOpen)}
          className="h-8 w-8 text-white lg:hidden cursor-pointer"
        />
        <div className="flex-row items-center space-x-3 hidden lg:inline-flex">
          <div
            onClick={() => {
              navigate("/Create");
            }}
            className="cursor-pointer"
          >
            Create
          </div>
          <div
            onClick={() => {
              navigate("/Character");
            }}
            className="cursor-pointer"
          >
            Character
          </div>
        </div>
        <div>
          {connectedAccount ? (
            <button className="ConnectBtn">
              {truncate(connectedAccount,4,4,11)}
            </button>
          ) : (
            <button onClick={Connect} className="ConnectBtn">
              Connect
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
