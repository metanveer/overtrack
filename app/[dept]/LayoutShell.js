"use client";

import { useState, useEffect, useRef } from "react";

import Breadcrumb from "../components/Breadcrump";

import Footer from "../components/Footer";

import getNavLinks from "@/utils/getNavLinks";
import TopBar from "../components/layout/TopBar";
import SideBar from "../components/layout/SideBar";

export default function LayoutShell({
  children,
  employees,
  units,
  otTypes,
  otHours,
  dept,
  session,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

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

  const navLinks = getNavLinks(employees, units, otTypes, otHours, dept);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}

      <TopBar
        isSideBarOpen={sidebarOpen}
        onSideBarOpen={() => setSidebarOpen(!sidebarOpen)}
        session={session}
      />

      {/* Sidebar */}

      <SideBar
        sidebarRef={sidebarRef}
        handleLinkClick={handleLinkClick}
        sidebarOpen={sidebarOpen}
        navLinks={navLinks}
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
