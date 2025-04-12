import Link from "next/link";

const CustomLink = ({ href, label }) => {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center text-indigo-900 bg-indigo-300 hover:bg-indigo-400 transition-colors duration-300 ease-in-out text-lg font-semibold py-5 px-6 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
    >
      {label}
    </Link>
  );
};

export default CustomLink;
