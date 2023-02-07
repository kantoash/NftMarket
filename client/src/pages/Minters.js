import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { truncate, useGlobalState } from "../utils";

function Minters() {
  const [marketContract] = useGlobalState("marketContract");
  const [Avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const CharacterLoad = async () => {
      // characterCount
      const CharacterCount = await marketContract.getAvatarCount();
      let allAvatars = [];
      for (let idx = 1; idx <= CharacterCount; idx++) {
        const Avatar = await marketContract.getAvatar(idx);
        let item = {
                id: idx,
                address: Avatar?.Address,
                name: Avatar?.name,
                description: Avatar?.description,
                image: Avatar?.image,
              };
        allAvatars.push(item);
      }
      setAvatars(allAvatars);
      setLoading(false);
    };
    CharacterLoad();
  }, []);

  if (loading) {
    return (
      <h3 className=" bg-PrimaryDark h-screen w-screen overflow-x-hidden text-4xl animate-pulse p-10 text-blue-500">
        Loading...
      </h3>
    );
  }

  return (
    <div className="min-h-screen p-10 space-y-3 flex flex-col bg-PrimaryDark  ">
    <h3 className="text-4xl py-12 text-gray-400">Minters</h3>
    {Avatars.map((character,id) => (
      <div onClick={() => navigate("/Characterpage/" + character?.id)} className="flex flex-row space-x-4 items-center hover:bg-gray-600 hover:opacity-80 transition-colors duration-200 p-3 rounded-lg  cursor-pointer ">
            <div>
                <img src={`https://gateway.pinata.cloud/ipfs//${character?.image.substring(
                  7
                )}`}
                className="h-32 w-32 object-fill cursor-pointer rounded-md " />
            </div>
            <div className="flex flex-col space-y-1 justify-center text-blue-300 font-semibold ">
                <h3>{truncate(character?.address,5,5,15)}</h3>
                <h3 className="font-serif">{character?.name}</h3>
                <p className="text-base ">{character?.description}</p>
            </div>
      </div>
    ))}
  </div>
  )
}

export default Minters;
