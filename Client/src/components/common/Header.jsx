import React from "react";
import TopBar from "../layout/TopBar";
import NavBar from "./NavBar";

const Header = () => {
  return (
    <div>
      {/* Topbar */}
      <TopBar />
      {/* Navbar */}
      <div className="shadow-xs">
        <NavBar />
      </div>
      {/* cart Drawer */}
    </div>
  );
};

export default Header;
