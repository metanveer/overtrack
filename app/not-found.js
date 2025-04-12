import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center pt-30">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Sorry!</h1>
        <p className="text-xl text-gray-600 mb-6">
          {"The page you're looking for doesn't exist!"}
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
