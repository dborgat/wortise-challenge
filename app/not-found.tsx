import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 font-(family-name:--font-geist-sans)">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">Page not found</h2>
        <p className="text-gray-600 mb-6">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
