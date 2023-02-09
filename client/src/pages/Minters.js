import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { truncate, useGlobalState } from "../utils";


function Minters() {
  const [marketContract] = useGlobalState("marketContract");
  const [Avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState();
  const navigate = useNavigate();

  const CharacterLoad = async () => {
    // characterCount
    let allAvatars = await marketContract.getAvatars();
    let Avatars = await Promise.all(
      allAvatars.map((avatar) => {
        let temp = {
          id: avatar.id,
          name: avatar.name,
          description: avatar.description,
          address: avatar.Address,
          image: avatar.image,
        };
        return temp;
      })
    );
    setAvatars(Avatars);
  };

  useEffect(() => {
    setLoading(true);
    CharacterLoad();
    setLoading(false);
  }, [marketContract]);

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
      {Avatars.map((avatar) => (
        <div
          onClick={() => navigate("/Characterpage/" + avatar?.id)}
          className="flex flex-row space-x-4 items-center hover:bg-gray-600 hover:opacity-80 transition-colors duration-200 p-3 rounded-lg  cursor-pointer "
        >
        <div>
                <img src={`https://gateway.pinata.cloud/ipfs//${avatar?.image}`}
                className="h-32 w-32 object-fill cursor-pointer rounded-md " />
            </div>
          {/*  
            */}
          <div className="flex flex-col space-y-1 justify-center text-blue-300 font-semibold ">
            <h3>{avatar?.address}</h3>
            <h3 className="font-serif">{avatar?.name}</h3>
            <p className="text-base ">{avatar?.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Minters;
