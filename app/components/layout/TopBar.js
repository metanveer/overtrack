"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "../Logo";
import { MenuIcon, XIcon, SearchIcon } from "lucide-react";
import CurrentUser from "../auth/CurrentUser";
import SearchModal from "./SearchModal";

const TopBar = ({ onSideBarOpen, isSideBarOpen, session, dept }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname(); // 👈 Get current path

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/" && pathname !== "/") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const showSearchButton = pathname !== "/"; // 👈 Only show search if not on home

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md flex items-center justify-between px-4 z-50">
        <Link href="/">
          <Logo />
        </Link>

        <div className="flex items-center gap-4 ml-auto">
          {/* Search Buttons (conditionally shown) */}
          {showSearchButton && (
            <>
              {/* Search Button - Large screens only */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:shadow-sm hover:bg-blue-100 transition"
                title="Press Ctrl + / to search"
              >
                <SearchIcon className="w-4 h-4 text-gray-500" />
                <span>Search OT</span>
                <kbd className="ml-2 px-1.5 py-0.5 text-xs font-mono text-gray-500 bg-gray-100 border rounded">
                  Ctrl + /
                </kbd>
              </button>

              {/* Search Icon Only - Small and Medium screens */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex lg:hidden p-2 rounded-full hover:bg-gray-100"
                title="Search"
              >
                <SearchIcon className="w-5 h-5 text-gray-700" />
              </button>
            </>
          )}

          <CurrentUser session={session} />

          {/* Menu Button at Right-most */}
          {!isSideBarOpen && (
            <button
              className="md:hidden cursor-pointer ml-2"
              onClick={onSideBarOpen}
              aria-label="Toggle menu"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          )}

          {isSideBarOpen && (
            <button
              className="md:hidden cursor-pointer ml-2"
              onClick={onSideBarOpen}
              aria-label="Toggle menu"
            >
              <XIcon className="w-6 h-6" />
            </button>
          )}
        </div>
      </header>

      {/* Search Modal */}
      {isSearchOpen && (
        <SearchModal dept={dept} onClose={() => setIsSearchOpen(false)} />
      )}
    </>
  );
};

export default TopBar;
