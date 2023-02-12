import { BellAlertIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useGlobalContext } from "../utils/Context";
function Alert() {
  const { showAlert } = useGlobalContext();

  return (
    <div
      className={`bg-opacity-30 bg-blue-600 self-center flex flex-row space-x-2 p-3 rounded-full justify-center text-xl text-white ${
        showAlert?.status ? "scale-100" : "scale-0"
      }`}
    >
      <BellAlertIcon className="h-6" />
      <p className="text-base">{showAlert?.message}</p>
    </div>
  );
}

export default Alert;
