import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation, } from 'react-router-dom';
import { FiLoader } from 'react-icons/fi';

const RouteSignIn = lazy(() => import('../routes/signin'));
const RouteSignUp = lazy(() => import('../routes/signup'));
const RouteDashboard = lazy(() => import('../routes/dashboard'));
const RouteLookUo = lazy(() => import('../routes/lookup'));

const Loader: React.FC = () => (
  <div className="flex h-screen items-center justify-center bg-gray-100">
    <FiLoader className="animate-spin text-4xl text-purple-600" />
  </div>
);

export default function RoutesOutlet() {
  const location = useLocation();

  if (location.pathname === '/') {
    return <Navigate to="/signin" replace />;
  }

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/signin" element={<RouteSignIn />} />
        <Route path="/signup" element={<RouteSignUp />} />
        <Route path="/look" element={<RouteLookUo />} />
        {/* <Route element={<RequireAuth />}> */}
          <Route path="/dashboard" element={<RouteDashboard />} />
        {/* </Route> */}
      </Routes>
    </Suspense>
  );
}
