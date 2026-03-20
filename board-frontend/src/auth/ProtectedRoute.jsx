import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function ProtectedRoute({ children }) {
    const { currentUser, authLoading } = useAuth();
    const location = useLocation();

    if (authLoading) {
        return (
            <div className="page-shell">
                <div className="empty-state">세션을 확인하는 중입니다.</div>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return children;
}
