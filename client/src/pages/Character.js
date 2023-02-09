import { ArrowRightIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useGlobalState } from "../utils";

function Character() {
  const [preview, setPreview] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [name, setName] = useState("");
  const [marketContract] = useGlobalState('marketContract');
  const [description, setDescription] = useState("");
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

        const imageURL = `${response.data.IpfsHash}`;
        setImageUrl(imageURL);
        console.log("image uploaded", imageURL);
      } catch (error) {
        console.log("error image upload", error);
      }
    }
  };

  const CharacterCreate = async (e) => {
    e.preventDefault();
    try {
      const CreateTxn = await marketContract.CharacterMake(name, description, imageUrl);
    await CreateTxn.wait()
    reset();
    navigate('/');
    } catch (error) {
      console.log("Character Create error", error);
    }
  }

  const reset = () => {
    setName("");
    setDescription("");
    setImageUrl("");
  }

  return (
    <div className="h-screen bg-PrimaryDark flex items-center justify-center bg-opacity-80 ">
      <div className="bg-[#1d314b] CreateShadow rounded-xl w-3/4 p-6 ">
      <h1 className="text-3xl text-center text-white uppercase py-8">Create Avatar</h1>
        <form onSubmit={CharacterCreate} className="flex flex-col justify-center space-y-5 ">
          {/* // image  */}
          <div className="self-center py-10">
            <img
              src={`${preview || "https://links.papareact.com/ucj"}`}
              alt="image"
              className="h-60 rounded-lg object-contain"
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

          <button
          type="submit"
          className="text-2xl text-white bg-blue-500 py-3 rounded-xl active:scale-105 transition-all duration-200 ease-in-out cursor-pointer uppercase "
        >
          create 
        </button>
        </form>
      </div>
    </div>
  );
}

export default Character;
