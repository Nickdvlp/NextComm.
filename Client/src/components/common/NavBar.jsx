import React, { useState } from "react";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import CartDrawer from "../layout/CartDrawer";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

const NavBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavDrawerToggle = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };
  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-1 px-6 ">
        {/* Left-Logo */}
        <div>
          <Link to="/">
            <img src="/logo-for-white.png" className="w-12 md:w-16" />
          </Link>
        </div>
        {/* Navigation Links */}
        <div className="hidden md:flex gap-6">
          <Link
            to="/collections/all?gender=Men"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Men
          </Link>
          <Link
            to="/collections/all?gender=Women"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Women
          </Link>
          <Link
            to="/collections/all?category=Top Wear"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Top wear
          </Link>
          <Link
            to="/collections/all?category=Bottom Wear"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            bottom wear
          </Link>
        </div>
        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              className="block text-sm bg-black tracking-wider text-white px-2 py-1 rounded-lg"
            >
              Admin
            </Link>
          )}

          <Link to="/profile" className="hover:text-black">
            <HiOutlineUser className="w-6 h-6" />
          </Link>
          <button
            onClick={handleDrawerToggle}
            className="relative cursor-pointer hover:text-black"
          >
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            <span className="absolute -top-1 bg-black text-white text-xs rounded-full px-2 py-0.5">
              4
            </span>
          </button>

          {/* Search */}
          <div className="overflow-hidden">
            <SearchBar />
          </div>
          <button onClick={handleNavDrawerToggle} className="md:hidden">
            <HiBars3BottomRight className="h-6 w-6 text-gray-700 cursor-pointer" />
          </button>
        </div>
      </nav>
      <CartDrawer
        drawerOpen={drawerOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      {/* Mobile NavBar */}
      {navDrawerOpen && (
        <div
          className={`fixed top-0 left-0 w-2/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-all duration-300 z-50 ${
            navDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-end p-4">
            <button>
              <IoMdClose
                onClick={handleNavDrawerToggle}
                className="w-6 h-6 text-gray-600 cursor-pointer"
              />
            </button>
          </div>

          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Menu</h2>

            <nav className="space-y-4">
              <Link
                to="/collections/all?gender=Men"
                onClick={handleNavDrawerToggle}
                className="block text-gray-600 hover:text-black"
              >
                Men
              </Link>
              <Link
                to="/collections/all?gender=Women"
                onClick={handleNavDrawerToggle}
                className="block text-gray-600 hover:text-black"
              >
                Women
              </Link>
              <Link
                to="/collections/all?category=Top Wear"
                onClick={handleNavDrawerToggle}
                className="block text-gray-600 hover:text-black"
              >
                Top Wear
              </Link>
              <Link
                to="/collections/all?category=Bottom Wear"
                onClick={handleNavDrawerToggle}
                className="block text-gray-600 hover:text-black"
              >
                Bottom Wear
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
