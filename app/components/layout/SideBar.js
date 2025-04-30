import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import LogoutBtn from "../auth/LogoutBtn";

const SideBar = ({
  sidebarRef,
  handleLinkClick,
  sidebarOpen,
  navLinks,
  onClickOverlay,
  session,
}) => {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClickOverlay}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`fixed top-16 left-0 bg-white shadow-md w-60 h-[calc(100vh-4rem)] transition-transform duration-300 z-40
      ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:block`}
      >
        <nav className="flex flex-col mt-3">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={handleLinkClick}
              className={`pr-2 pl-6 py-2 transition-colors duration-200 ${
                pathname === href?.split("?")[0]
                  ? "text-blue-600 font-semibold bg-blue-100"
                  : "text-black hover:text-blue-600"
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="lg:hidden md:hidden">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile ({session?.user?.role})
            </Link>

            <LogoutBtn />
          </div>
        </nav>
      </aside>
    </>
  );
};

export default SideBar;
