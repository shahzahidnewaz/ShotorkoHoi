import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/AuthContext.jsx";
import { ErrorState } from "./Atoms.jsx";

export default function RequireAdmin({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user.role !== "admin") {
    return (
      <section className="py-14">
        <div className="max-w-wide mx-auto px-5">
          <ErrorState
            title="Admin access required"
            body="Your account doesn't have permission to view this page."
          />
        </div>
      </section>
    );
  }

  return children;
}
