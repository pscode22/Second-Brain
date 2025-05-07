import { Link } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi';

export default function PageNotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <FiAlertCircle className="mb-4 text-6xl text-purple-600" />
      <h1 className="mb-2 text-4xl font-bold text-purple-600">404 – Page Not Found</h1>
      <p className="mb-6 text-lg text-gray-600">Oops! The page you’re looking for doesn’t exist.</p>
      <Link
        to="/dashboard"
        className="inline-block cursor-pointer rounded-lg bg-purple-600 px-6 py-2 text-white transition hover:opacity-95"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
