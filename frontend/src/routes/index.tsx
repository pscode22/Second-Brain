import { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { FiLoader } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const RouteSignIn = lazy(() => import('../routes/signin'));
const RouteSignUp = lazy(() => import('../routes/signup'));
const RouteDashboard = lazy(() => import('../routes/dashboard'));
const RouteProfile = lazy(() => import('../routes/profile'));
const RoutePageNotFound = lazy(() => import('../routes/notfound'));
const RouteTwitter = lazy(() => import('../routes/twitter'));
const RouteYoutube = lazy(() => import('../routes/youtube'));
const RouteLayout = lazy(() => import('../routes/layout'));

const Loader: React.FC = () => (
  <div className="flex h-screen items-center justify-center bg-gray-100">
    <FiLoader className="animate-spin text-4xl text-purple-600" />
  </div>
);

function RequireAuth() {
  const location = useLocation();
  const { isTokenValid } = useAuth();

  if (isTokenValid === false) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default function RoutesOutlet() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* '/' -> '/signin' */}
        <Route index element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<RouteSignIn />} />
        <Route path="/signup" element={<RouteSignUp />} />
        {/* Protected routes */}
        <Route element={<RequireAuth />}>
          <Route element={<RouteLayout />}>
            <Route path="/dashboard" element={<RouteDashboard />} />
            <Route path="/profile" element={<RouteProfile />} />
            <Route path="/twitter" element={<RouteTwitter />} />
            <Route path="/youtube" element={<RouteYoutube />} />
          </Route>
        </Route>
        {/* Catch-all */}
        + <Route path="*" element={<RoutePageNotFound />} />
      </Routes>
    </Suspense>
  );
}
