export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#161a23] text-white">
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="mb-6 text-lg text-gray-300">
        Sorry, the page you’re looking for doesn’t exist.
      </p>
      <a
        href="/"
        className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-full text-white font-semibold transition"
      >
        Go Home
      </a>
    </div>
  );
}