import "./index.css";
import { useEffect } from "react";
import { ethers } from "ethers";
import { Route, Routes } from "react-router-dom";
import { Home, Create, Character, Characterpage, NftPage } from "./pages/index";
import { Footer, Header } from "./component/index";
import {
  NFT,
  Marketplace,
  marketAddress,
  nftContractAddress,
} from "./utils/index";
import { useGlobalContext } from "./utils/Context";


function App() {
  const { setConnectedAccount, setNftContract, setMarketContract } =
    useGlobalContext();

  useEffect(() => {
    const web3Handler = async () => {
      try {
        if (!window.ethereum) {
          console.log("window etherum no found please install metamask");
        }
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        setConnectedAccount(accounts[0]?.toLowerCase());
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", async () => {
          await web3Handler();
          window.location.reload();
        });
        const Provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = Provider.getSigner();

        const nftContract = new ethers.Contract(
          nftContractAddress,
          NFT.abi,
          signer
        );
        setNftContract(nftContract);
        const marketContract = new ethers.Contract(
          marketAddress,
          Marketplace.abi,
          signer
        );
        setMarketContract(marketContract);
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
        <Route path="/NftPage/:itemId/:name" element={<NftPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
