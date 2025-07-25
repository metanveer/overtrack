"use client";
import React, { useEffect, useState, useTransition } from "react";
import { XIcon } from "lucide-react";

import { searchByWorkDescription } from "@/app/actions/searchActions";
import formatDate, { getDayName } from "@/utils/formatDate";

import TextLink from "../TextLink";
import Link from "next/link";

const SearchModal = ({ onClose, dept }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  // Escape to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        startTransition(async () => {
          const res = await searchByWorkDescription(query, dept);
          setResults(res);
        });
      } else {
        setResults([]);
      }
    }, 300); // debounce input by 300ms

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-xl p-6 relative shadow-xl">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="Close search"
        >
          <XIcon className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold mb-4">Search OT</h2>
        <input
          type="text"
          autoFocus
          placeholder="Type to search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-blue-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        />

        <div className="max-h-60 overflow-y-auto">
          {isPending && <p className="text-sm text-gray-500">Searching...</p>}
          {!isPending && results.length === 0 && query && (
            <p className="text-sm text-gray-500">No results found.</p>
          )}
          {results.map((item) => (
            <Link
              onClick={() => onClose()}
              key={item._id}
              href={`/${dept}/overtime/slip?id=${item._id}`}
            >
              <div className="border-b py-2 px-2 hover:bg-gray-50 rounded-md transition">
                <p className="font-medium">{item.WorkDescription}</p>

                <p className="text-sm text-gray-500">
                  {formatDate(item.Date)} ({getDayName(item.Date)}) –{" "}
                  {item.Type}
                </p>
                <p className="text-xs text-gray-400">
                  {item.Employee.map((e) => e.Name).join(", ")}
                </p>
              </div>{" "}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
