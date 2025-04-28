"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen p-4 text-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full mt-4">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="64"
            height="64"
            className="text-red-500"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-9h2v5h-2zm0 6h2v2h-2z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          We regret that the requested content is unavailable!
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          It is possible that the content has been removed or relocated to a
          different address.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          <Link href="/">
            <span className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium">
              Go to Home
            </span>
          </Link>
        </div>

        {/* Optional Go Back */}
        <button
          onClick={() => window.history.back()}
          className="mt-4 text-blue-600 hover:underline"
        >
          Go back
        </button>
      </div>
    </main>
  );
}
