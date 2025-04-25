import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { FiLoader } from 'react-icons/fi';

const RouteSignIn = lazy(() => import('../routes/signin'));
const RouteSignUp = lazy(() => import('../routes/signup'));
const RouteDashboard = lazy(() => import('../routes/dashboard'));

const Loader: React.FC = () => (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <FiLoader className="animate-spin text-4xl text-purple-600" />
    </div>
  )

export default function RoutesOutlet() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/signin" element={<RouteSignIn />} />
        <Route path="/signup" element={<RouteSignUp />} />
        <Route path="/dashboard" element={<RouteDashboard />} />
      </Routes>
    </Suspense>
  );
}
