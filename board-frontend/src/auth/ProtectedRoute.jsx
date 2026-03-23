import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function ProtectedRoute({ children, requireAdmin = false }) {
    const { currentUser, authLoading } = useAuth();
    const location = useLocation();

    if (authLoading) {
        return (
            <div className="page-shell">
                <div className="empty-state">Checking your session.</div>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    if (requireAdmin && currentUser.role !== "ADMIN") {
        return (
            <div className="page-shell">
                <div className="empty-state error-state">This page is available to admins only.</div>
            </div>
        );
    }

    return children;
}
