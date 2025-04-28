"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import Breadcrumb from "../components/Breadcrump";
import Logo from "../components/Logo";
import Footer from "../components/Footer";

import { adminOptions } from "./admin-options";
import TopBar from "../components/layout/TopBar";
import SideBar from "../components/layout/SideBar";

export default function AdminLayoutShell({ children, session }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const pathname = usePathname();

  // Close sidebar on outside click (only on small screens)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <TopBar
        isSideBarOpen={sidebarOpen}
        onSideBarOpen={() => setSidebarOpen(!sidebarOpen)}
        session={session}
      />

      <SideBar
        sidebarRef={sidebarRef}
        handleLinkClick={handleLinkClick}
        sidebarOpen={sidebarOpen}
        navLinks={adminOptions}
        onClickOverlay={() => setSidebarOpen(false)}
        session={session}
      />

      {/* Main Content + Footer Wrapper */}
      <div className="pt-18 md:ml-52 p-4 flex-grow bg-gray-100">
        <Breadcrumb />
        {children}
      </div>

      {/* Footer always at bottom */}
      <div className="md:ml-52">
        <Footer />
      </div>
    </div>
  );
}
