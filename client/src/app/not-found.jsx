import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F0E8E8] px-4">
      <div className="text-center max-w-md">
        {/* 404 Number */}
        <h1 className="text-9xl font-black text-[#E67514] mb-4">404</h1>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Oops! Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-lg mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track!
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-[#E67514] text-white font-semibold rounded-lg hover:bg-[#d46609] transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/products"
            className="px-8 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
