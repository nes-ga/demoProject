import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function AuthControls() {
    const { currentUser, authLoading, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    if (authLoading) {
        return <div className="auth-controls"><span className="auth-muted">Checking session...</span></div>;
    }

    if (!currentUser) {
        return (
            <div className="auth-controls">
                <button type="button" className="secondary-button" onClick={() => navigate("/login")}>
                    Login
                </button>
            </div>
        );
    }

    return (
        <div className="auth-controls">
            <button type="button" className="auth-badge auth-badge-button" onClick={() => navigate("/mypage")}>
                myPage
            </button>
            {currentUser.role === "ADMIN" ? (
                <button type="button" className="secondary-button" onClick={() => navigate("/admin")}>
                    Admin
                </button>
            ) : null}
            <button type="button" className="secondary-button" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}
