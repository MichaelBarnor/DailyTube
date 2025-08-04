export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <img
        src="/tabicon.png"
        alt="DailyTube Logo"
        className="w-16 h-16 mb-6"
      />
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="mb-6 text-lg text-gray-300">
        Sorry, the page you’re looking for doesn’t exist.
      </p>
      <a
        href="/"
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold transition"
      >
        Go Home
      </a>
    </div>
  );
}