import React from "react";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";

const TopBar = () => {
  return (
    <div className="bg-black text-white">
      <div className="container mx-auto flex justify-between items-center py-2 px-4">
        <div className=" hidden md:flex items-center gap-4 justify-center">
          <a href="#" className="hover:bg-gray-400 h-4 w-4">
            <TbBrandMeta />
          </a>
          <a href="#" className="hover:bg-gray-600 h-4 w-4">
            <IoLogoInstagram />
          </a>
          <a href="#" className="hover:bg-gray-400 h-4 w-4">
            <RiTwitterXLine />
          </a>
        </div>
        <div className="text-sm text-center flex-grow">
          <span>Choose Us! for fast and relible shipping</span>
        </div>
        <div className="text-sm hidden md:block">
          <a href="tel:+91969022435" className="hover:underline">
            +919690222435
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
