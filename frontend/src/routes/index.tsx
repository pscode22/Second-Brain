import { lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/ui/Loader";

// Lazy-loaded routes
const RouteSignIn = lazy(() => import("../routes/signin"));
const RouteSignUp = lazy(() => import("../routes/signup"));
const RouteDashboard = lazy(() => import("../routes/dashboard"));
const RouteProfile = lazy(() => import("../routes/profile"));
const RoutePageNotFound = lazy(() => import("../routes/notfound"));
const RouteTwitter = lazy(() => import("../routes/twitter"));
const RouteYoutube = lazy(() => import("../routes/youtube"));
const RouteLayout = lazy(() => import("../routes/layout"));
const RouteShare = lazy(() => import("../routes/share"));
const RouteIntro = lazy(() => import("../routes/intro"));

/**
 * 🧠 Auth guard for protected routes
 * - Redirects unauthenticated users to /signin
 * - Shows loader during token validation check
 */
function RequireAuth() {
  const location = useLocation();
  const { isTokenValid } = useAuth();

  // While checking token validity, show loader
  if (isTokenValid === null) {
    return <Loader />;
  }

  // Redirect to signin if invalid or expired
  if (isTokenValid === false) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

/**
 * 🧭 Centralized App Routing
 */
export default function RoutesOutlet() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* 🌍 Public Routes */}
        <Route path="/" element={<RouteIntro />} />
        <Route path="/signin" element={<RouteSignIn />} />
        <Route path="/signup" element={<RouteSignUp />} />
        <Route path="/share/:shareLink" element={<RouteShare />} />

        {/* 🔒 Protected Routes */}
        <Route element={<RequireAuth />}>
          <Route element={<RouteLayout />}>
            <Route path="/dashboard" element={<RouteDashboard />} />
            <Route path="/profile" element={<RouteProfile />} />
            <Route path="/twitter" element={<RouteTwitter />} />
            <Route path="/youtube" element={<RouteYoutube />} />
          </Route>
        </Route>

        {/* 🚫 404 Fallback */}
        <Route path="*" element={<RoutePageNotFound />} />
      </Routes>
    </Suspense>
  );
}

