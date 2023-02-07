import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";

function AvatarRow({ Avatars }) {
  const navigate = useNavigate();
  const rowRef = useRef(null);
  const [isMoved, setIsMoved] = useState(false);
  const handleClick = (direction) => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === "left" ? (
        scrollLeft - 200
      ) : (
        scrollLeft + 200
      )

      rowRef.current.scrollTo({left: scrollTo, behavior: "smooth"})
    }
  };

  
  return (
    <div className="flex flex-col items-center text-lg font-semibold  text-white overflow-x-hidden ">
      <div className="flex flex-row items-center space-x-3 ">
        <div onClick={() => handleClick("left")}>
          <ChevronLeftIcon className="h-10 hover:bg-opacity-20 hover:bg-white p-1 rounded-full transition-colors duration-200 text-blue-300 cursor-pointer" />
        </div>
        <div>
          <ChevronRightIcon onClick={() => handleClick("right")} className="h-10 hover:bg-opacity-20 hover:bg-white p-1 rounded-full transition-colors duration-200 text-blue-300 cursor-pointer" />
        </div>
      </div>
      {/* movie list */}
      <div ref={rowRef} className="flex flex-row items-center overflow-x-scroll  scrollbar-hide  ">
        {Avatars.map((Avatar, id) => (
          <div className="flex flex-col items-center justify-center space-y-1 min-w-fit p-3 m-3 cursor-pointer ">
            <div onClick={() => navigate("/Characterpage/" + Avatar?.id)}>
              <img
                src={`https://gateway.pinata.cloud/ipfs//${Avatar?.image.substring(
                  7
                )}`}
                className="h-32 w-32 object-fill rounded-full cursor-pointer "
              />
            </div>
            <h3 className="text-base font-thin text-blue-500 ">{Avatar?.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AvatarRow;
