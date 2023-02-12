import { ArrowRightIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import axios from 'axios'
import { useGlobalState } from '../utils';
import { ethers } from 'ethers';

function Create() {
  const [preview, setPreview] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [price, setPrice] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nftContract] = useGlobalState('nftContract') 
  const [marketContract] = useGlobalState('marketContract')
  const navigate = useNavigate();
  const key = "416ca77cc3022781d2a0";
  const secret =
    "4b93c9c487dbd2e98e3cc4c12bc8e6406873f1814118fdc3dd42ea8cc9648a80";

    const changeImage = async (e) => {
      e.preventDefault();
      const imageData = e.target.files[0];
      if (imageData) {
        setPreview(URL.createObjectURL(imageData));
        try {
          const formData = new FormData();
          formData.append("file", imageData);
  
          const response = await axios({
            method: "post",
            url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
            data: formData,
            headers: {
              pinata_api_key: key,
              pinata_secret_api_key: secret,
            },
          });
  
          const imageURL = `ipfs//${response.data.IpfsHash}`;
          setImageUrl(imageURL);
          console.log("image uploaded", imageURL);
        } catch (error) {
          console.log("error image upload", error);
        }
      }
    };
  
    const CreateNft = async (e) => {
      e.preventDefault();
      if (!name || !description || !price || !imageUrl) {
        return;
      }

      const nftJson = {
        name,
        description,
        price,
        image: imageUrl
      }

      try {
        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          data: nftJson,
          headers: {
            pinata_api_key: key,
            pinata_secret_api_key: secret,
          }
        })

        const metaDataUri = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

        const mint = await nftContract.mint(metaDataUri);
        await mint.wait();
        console.log("nft mint", mint);

        const id = await nftContract.tokenCount();
        
        const createFee = await marketContract.getFee();
        const Item = await marketContract.makeItem(
          nftContract.address, 
          id, 
          ethers.utils.parseEther(price.toString())
          , { value: ethers.utils.parseUnits(createFee.toString(), "wei") });
        console.log("Item create", Item);
        await Item.wait();
        reset()
        navigate('/')
      } catch (error) {
        console.log("Item created error", error);
      }
    }

    const reset = () => {
      setName("")
      setDescription("")
      setPrice("")
      setImageUrl("")
    }
    
  return (
    <div className="h-screen bg-PrimaryDark flex items-center justify-center bg-opacity-80 overflow-x-hidden ">
    <div className="bg-[#1d314b] CreateShadow rounded-xl w-full p-6 m-10 ">
      <form
      onSubmit={CreateNft}
        className="flex flex-col space-y-8 justify-center  "
      >
        {/* // image  */}
        <div className="self-center py-10">
          <img
            src={`${preview || "https://links.papareact.com/ucj"}`}
            alt="image"
            className="h-60 rounded-lg object-contain"
          />
        </div>
        <div className="flex flex-row justify-between items-center rounded-xl bg-gray-700 mt-5 p-2">
          <h3 className="  text-xl text-white px-4 min-w-fit ">
            Choose Image
          </h3>

          <input
            type="file"
            onChange={changeImage}
            className="w-full text-lg text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-[1px] file:border-Primary cursor-pointer focus:ring-0   focus:outline-none"
          />
        </div>
        <div className="CreateInputDiv">
          <ArrowRightIcon className="h-5 text-white" />
          <input
            type="text"
            placeholder="title"
            className="Createinput block"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="CreateInputDiv">
          <ArrowRightIcon className="h-5 text-white" />
          <input
            type="text"
            placeholder="description"
            className="Createinput block"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="CreateInputDiv">
          <ArrowRightIcon className="h-5 text-white" />
          <input
            type="text"
            placeholder="price"
            className=" Createinput block"
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <button
        type='submit'
          className="text-2xl text-white bg-blue-500 py-3 rounded-xl active:scale-105 transition-all duration-200 ease-in-out cursor-pointer "
        >
          createNft
        </button>
      </form>
    </div>
  </div>

  )
}

export default Create