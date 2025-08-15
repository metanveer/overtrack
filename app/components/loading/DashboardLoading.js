import React from "react";

// You can use any icon library or SVG for the logo placeholder
const LogoPlaceholder = () => (
  <svg
    className="w-8 h-8 text-gray-300"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);

const SkeletonCard = () => (
  <div className="bg-gray-200 p-6 rounded-lg w-full">
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
    <div className="h-10 bg-gray-300 rounded w-1/2"></div>
  </div>
);

const SkeletonTableRow = () => (
  <tr className="border-b border-gray-200">
    <td className="p-4">
      <div className="h-4 bg-gray-300 rounded w-8"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    </td>
    <td className="p-4">
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </td>
  </tr>
);

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="flex">
        {/* Sidebar Skeleton */}
        <aside className="w-64 bg-white p-6 hidden md:block border-r border-gray-200">
          <div className="flex items-center mb-10">
            <div className="bg-gray-200 p-2 rounded-lg">
              <LogoPlaceholder />
            </div>
            <div className="ml-3">
              <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <nav className="animate-pulse">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded mb-4"></div>
            ))}
          </nav>
        </aside>

        <main className="flex-1">
          {/* Header Skeleton */}
          <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="flex items-center space-x-4">
              <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </header>

          {/* Main Content Skeleton */}
          <div className="p-8 animate-pulse">
            {/* Breadcrumbs */}
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>

            {/* Title */}
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-8"></div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>

            {/* Table Section */}
            <div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="p-4 text-left">
                        <div className="h-4 bg-gray-300 rounded w-12"></div>
                      </th>
                      <th className="p-4 text-left">
                        <div className="h-4 bg-gray-300 rounded w-32"></div>
                      </th>
                      <th className="p-4 text-left">
                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <SkeletonTableRow />
                    <SkeletonTableRow />
                    <SkeletonTableRow />
                    <SkeletonTableRow />
                    <tr className="border-t-2 border-gray-300">
                      <td colSpan="2" className="p-4 text-right">
                        <div className="h-4 bg-gray-300 rounded w-24 ml-auto"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
