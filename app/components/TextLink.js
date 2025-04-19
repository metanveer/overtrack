import Link from "next/link";

const TextLink = ({ href, text, isButton, btnClassName }) => {
  return (
    <Link
      href={href}
      className={
        isButton
          ? btnClassName
            ? btnClassName
            : "bg-blue-600 hover:bg-blue-800 text-white font-medium px-6 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          : "text-blue-600 hover:underline font-medium"
      }
    >
      {text}
    </Link>
  );
};

export default TextLink;
