import Link from "next/link";

const CustomLink = ({ href, label }) => {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center text-blue-600 hover:text-blue-700 bg-white transition-colors duration-300 ease-in-out text-lg font-semibold py-6 px-6 rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
    >
      {label}
    </Link>
  );
};

export default CustomLink;
