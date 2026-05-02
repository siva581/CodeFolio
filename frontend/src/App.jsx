import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import PublicPortfolioPage from "./pages/PublicPortfolioPage";
import ProfilesPage from "./pages/ProfilesPage";
import PremiumPage from "./pages/PremiumPage";
import Header from "./components/Header";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p className="center-message">Loading...</p>;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return children;
}

function LandingRoute() {
  if (typeof window === "undefined") return <HomePage />;

  const hostname = window.location.hostname;
  const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".localhost");
  const isVercel = hostname.includes("vercel.app") || hostname.includes("vercel.com");

  // Show HomePage for localhost and Vercel deployments, PublicPortfolioPage for custom domains
  return (isLocalHost || isVercel) ? <HomePage /> : <PublicPortfolioPage />;
}

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<LandingRoute />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profiles" element={<ProfilesPage />} />
          <Route path="/u/:username" element={<PublicPortfolioPage />} />
          <Route path="/:username" element={<PublicPortfolioPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
