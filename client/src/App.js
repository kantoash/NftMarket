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
  const marketAddress = "0xe430b30ad78cd6c8222ba818bdc1d110ff05ee46";
  const nftContractAddress = "0x545de0c1eb3dff2b89bc0b6455abca37ce70ae64";
  const [marketContract] = useGlobalState('marketContract')
  const [nftContract] = useGlobalState('nftContract')

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
        <Route path="/Characterpage/:id" element={<Characterpage />} />
        <Route path="/Minters" element={<Minters />} /> 
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
