import Link from "next/link";
import React from "react";
import Logo from "../Logo";
import { MenuIcon, XIcon } from "lucide-react";
import CurrentUser from "../auth/CurrentUser";

const TopBar = ({ onSideBarOpen, isSideBarOpen, session }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md flex items-center justify-between px-6 z-50">
      <Link href={`/`}>
        <Logo />
      </Link>
      <button
        className="md:hidden cursor-pointer"
        onClick={onSideBarOpen}
        aria-label="Toggle menu"
      >
        {isSideBarOpen ? (
          <XIcon className="w-6 h-6" />
        ) : (
          <MenuIcon className="w-6 h-6" />
        )}
      </button>
      <div className="hidden md:block text-base font-medium cursor-pointer">
        <CurrentUser session={session} />
      </div>
    </header>
  );
};

export default TopBar;
