import "./index.css";
import Marketplace from "./artifacts/contracts/Marketplace.sol/Marketplace.json";
import NFT from "./artifacts/contracts/NFT.sol/NFT.json";
import { useEffect } from "react";
import { ethers } from "ethers";
import { Route, Routes } from "react-router-dom";
import { Home, Create, Character, Characterpage, Minters } from "./pages/index";
import { setGlobalState, useGlobalState } from "./utils";
import { Footer, Header } from "./component/index";

function App() {
  const marketAddress = "0x4a932121C00CDaB0cd2C9250E99C1d529a5556D5";
  const nftContractAddress = "0xB98AbCE4F51bAc20b3ff9494891eFA31BdC2bcb7";

  useEffect(() => {
    const web3Handler = async () => {
      try {
        if (!window.ethereum) {
          console.log("window etherum no found please install metamask");
        }
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        setGlobalState("connectedAccount", accounts[0]?.toLowerCase());
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", async () => {
          await web3Handler();
          window.location.reload();
        });
        const Provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = Provider.getSigner();
        setGlobalState("connectedAccount", accounts[0]?.toLowerCase());
        const nftContract = new ethers.Contract(
          nftContractAddress,
          NFT.abi,
          signer
        );
        setGlobalState("nftContract", nftContract);
        const marketContract = new ethers.Contract(
          marketAddress,
          Marketplace.abi,
          signer
        );

        setGlobalState("marketContract", marketContract);
      } catch (error) {
        console.log("app loader error", error);
      }
    };
    web3Handler();
  }, []);

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Create" element={<Create />} />
        <Route path="/Character" element={<Character />} />
        <Route path="/Minters" element={<Minters />} />
        <Route path="/Characterpage/:id" element={<Characterpage />} /> 
        {/*
        */}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
