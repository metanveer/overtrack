"use client";

import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md flex items-center justify-between px-6 z-50">
      <div className="text-xl font-semibold">OT Management</div>
      <button
        className="md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? (
          <XIcon className="w-6 h-6" />
        ) : (
          <MenuIcon className="w-6 h-6" />
        )}
      </button>
      <div className="hidden md:block text-base font-medium cursor-pointer">
        Menu
      </div>
    </header>
  );
};

export default Header;
