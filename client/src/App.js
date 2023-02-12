import "./index.css";
import { useEffect } from "react";
import { ethers } from "ethers";
import { Route, Routes } from "react-router-dom";
import {
  Home,
  Create,
  Character,
  Characterpage,
  NftPage,
} from "./pages/index";
import { setGlobalState, NFT, Marketplace } from "./utils";
import { Footer, Header } from "./component/index";

function App() {
  const marketAddress = "0x79909f8D660948A72a2b1906800415dcB446C8aA";
  const nftContractAddress = "0x35185A61969d50314727CfE2E3E7AF2D8E6Fd033";

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
        <Route path="/NftPage/:itemId/:name" element={<NftPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
