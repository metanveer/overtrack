export default function Logo() {
  return (
    <div className="flex items-center space-x-3">
      {/* Rounded Waveform Icon */}
      <div className="w-8 h-8 flex items-center justify-center bg-indigo-100 rounded-full">
        <svg
          className="w-5 h-5 text-indigo-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2 12h2l2 6 4-12 4 12 2-6h4"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-tight">
        <span className="text-lg font-semibold tracking-tight text-indigo-700 font-sans">
          Over<span className="text-indigo-500 font-bold">Track</span>
        </span>
        <span className="hidden md:block text-xs text-gray-500 font-medium font-sans tracking-wide">
          Overtime Tracking and Management
        </span>
      </div>
    </div>
  );
}
