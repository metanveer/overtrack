"use client";
import React, { useState, useEffect, useRef } from "react";

import Link from "next/link";

import { ChevronDown, ChevronUp } from "lucide-react";
import LogoutBtn from "./LogoutBtn";

const CurrentUser = ({ session }) => {
  const isAdmin = session?.user?.role === "Admin";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="relative flex items-center">
      {session ? (
        <div className="relative" ref={menuRef}>
          <span
            className="flex items-center gap-1 cursor-pointer font-medium text-gray-700 hover:text-gray-900"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {session.user.username || session.user.email}
            {isMenuOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </span>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile ({session.user.role})
              </Link>

              {isAdmin && (
                <>
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Options
                  </Link>
                </>
              )}

              <LogoutBtn />
            </div>
          )}
        </div>
      ) : (
        <Link href={`/`}>
          <span className="font-medium text-gray-700 hover:text-gray-900 cursor-pointer">
            Login
          </span>
        </Link>
      )}
    </div>
  );
};

export default CurrentUser;
