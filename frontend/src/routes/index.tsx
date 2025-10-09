import { lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/ui/Loader";

// Lazy-loaded routes
const RouteSignIn = lazy(() => import("./Signin"));
const RouteSignUp = lazy(() => import("./Signup"));
const RouteDashboard = lazy(() => import("./Dashboard"));
const RouteProfile = lazy(() => import("./Profile"));
const RoutePageNotFound = lazy(() => import("./Notfound"));
const RouteTwitter = lazy(() => import("./Twitter"));
const RouteYoutube = lazy(() => import("./Youtube"));
const RouteLayout = lazy(() => import("./Layout"));
const RouteShare = lazy(() => import("./Share"));
const RouteIntro = lazy(() => import("./Intro"));

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

