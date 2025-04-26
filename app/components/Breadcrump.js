"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";

const Breadcrumb = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString(); // e.g. "month=april&year=2025"
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => {
    let href = "/" + segments.slice(0, index + 1).join("/");

    // ✅ Safely add query string only if not already present
    if (queryString && !href.includes("?")) {
      href += `?${queryString}`;
    }

    const name = decodeURIComponent(segment)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    return { name, href };
  });

  return (
    <nav className="mt-2 mb-4" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center text-gray-500">
        <li className="flex items-center">
          <Link
            href={`/${queryString ? `?${queryString}` : ""}`}
            className="text-blue-600 hover:underline font-medium"
          >
            Home
          </Link>
        </li>

        {breadcrumbs.map((crumb, idx) => (
          <li key={crumb.href} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            {idx === breadcrumbs.length - 1 ? (
              <span className="font-semibold text-gray-800">{crumb.name}</span>
            ) : (
              <Link
                href={crumb.href}
                className="text-blue-600 hover:underline font-medium transition-colors"
              >
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
