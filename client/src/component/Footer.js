import React from "react";
import { SocialIcon } from "react-social-icons";

function Footer() {
  return (
    <footer className="bg-PrimaryDark text-white flex flex-row  
     items-center justify-between space-x-5 px-4 py-1.5 sticky bottom-0 right-0 z-50 ">
      <div>
        <SocialIcon
          url="https://instagram.com"
          bgColor="transparent"
          fgColor="white"
        />
        <SocialIcon
          url="https://twitter.com"
          bgColor="transparent"
          fgColor="white"
        />
        <SocialIcon
          url="https://facebook.com"
          bgColor="transparent"
          fgColor="white"
        />
        <SocialIcon
          url="https://linkedin.com"
          bgColor="transparent"
          fgColor="white"
        />
      </div>
      <div>Copyright &copy; 2022 Crypto.com. All rights reserved.</div>
      <div className="flex flex-row items-center space-x-1">
        <a href="#">Help Center</a>
        <a href="#">T&C</a>
        <a href="#">Privacy Notice</a>
      </div>
    </footer>
  );
}

export default Footer;
