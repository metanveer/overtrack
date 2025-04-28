"use client";
import Link from "next/link";

export default function AccessDenied() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen p-4 text-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full">
        {/* Lock Icon */}
        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="64"
            height="64"
            className="text-blue-500"
            fill="currentColor"
          >
            <path d="M12 2a5 5 0 0 1 5 5v3h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h1V7a5 5 0 0 1 5-5zm-3 8h6V7a3 3 0 0 0-6 0v3zm-2 2v9h10v-9H7z" />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Access Restricted
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          You do not have permission to view this page. Please sign in with
          appropriate credentials or contact support.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          {/* <Link href="/login">
            <span className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium">
              Sign In
            </span>
          </Link> */}
          <Link href="/">
            <span className="block w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-medium">
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
