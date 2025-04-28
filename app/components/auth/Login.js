"use client";

import LoginForm from "./LoginForm";

export default function Login() {
  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row bg-indigo-50 overflow-hidden">
      {/* Full Screen Clock Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none z-0">
        <div className="fixed w-[1000px] h-[1000px] bg-white rounded-full border-[40px] border-indigo-300 shadow-2xl">
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-indigo-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

          {/* Hour hand */}
          <div className="absolute top-1/2 left-1/2 w-48 h-3 bg-indigo-500 rounded origin-center transform -translate-x-40 -translate-y-18 rotate-[45deg]"></div>

          {/* Minute hand */}
          <div className="absolute top-1/2 left-1/2 w-72 h-2 bg-indigo-400 rounded origin-center transform -translate-x-20 -translate-y-30 rotate-[120deg]"></div>

          {/* Second hand */}
          {/* <div className="absolute top-1/2 left-1/2 w-80 h-2 bg-red-400 rounded origin-center transform -translate-x-0-translate-y-0 rotate-[0deg]"></div> */}
          <div className="absolute top-1/2 left-1/2 w-80 h-2 bg-red-400 rounded origin-center transform -translate-x-40 -translate-y-40 rotate-[90deg]"></div>

          {/* Clock Numbers */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-indigo-400 font-extrabold text-7xl tracking-wider"
              style={{
                top: "46%",
                left: "51%",
                transform: `rotate(${i * 30}deg) translate(0, -410px) rotate(-${
                  i * 30
                }deg) translateX(-50%)`,
              }}
            >
              {i === 0 ? 12 : i}
            </div>
          ))}
        </div>
      </div>

      {/* Foreground Content */}
      <div className="flex flex-1 flex-col justify-center items-center p-8 z-10">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-24 h-24 flex items-center justify-center bg-indigo-200 rounded-full">
            <svg
              className="w-12 h-12 text-indigo-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2 12h2l2 6 4-12 4 12 2-6h4"
              />
            </svg>
          </div>
          <div className="text-6xl font-normal  text-indigo-700 font-sans">
            Over<span className="text-indigo-500 font-bold">Track</span>
          </div>
        </div>

        <p className="text-center text-indigo-700 font-light max-w-xs mb-8 text-2xl whitespace-nowrap">
          Manage overtime effortlessly
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
