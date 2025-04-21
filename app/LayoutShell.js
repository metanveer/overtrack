"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import Breadcrumb from "./components/Breadcrump";
import Logo from "./components/Logo";

export default function LayoutShell({ children }) {
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

  const navLinks = [
    { href: "/overtime/entry-form", label: "Entry Form" },
    { href: "/overtime", label: "Overtime" },
    { href: "/overtime/daily", label: "Daily" },
    { href: "/overtime/monthly", label: "Monthly" },
    { href: "/overtime/employee", label: "Employee Records" },
    { href: "/overtime/unit", label: "Unit Records" },
    { href: "/overtime/billing", label: "Billing" },
    { href: "/overtime/settings", label: "Settings" },
  ];

  return (
    <div>
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md flex items-center justify-between px-6 z-50">
        <Link href={`/`}>
          <Logo />
        </Link>
        <button
          className="md:hidden cursor-pointer"
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
          Admin
        </div>
      </header>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-16 left-0 bg-white shadow-md w-52 h-[calc(100vh-4rem)] p-4 transition-transform duration-300 z-40
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:block`}
      >
        <nav className="flex flex-col space-y-2">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={handleLinkClick}
              className={`px-2 py-1 rounded-md transition-colors duration-200 ${
                pathname === href
                  ? "text-blue-600 font-semibold bg-blue-100"
                  : "text-black hover:text-blue-600"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pt-18 md:ml-52 p-4 transition-all duration-300">
        <Breadcrumb />
        {children}
      </main>
    </div>
  );
}
