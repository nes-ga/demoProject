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
        return <div className="auth-controls"><span className="auth-muted">세션 확인 중...</span></div>;
    }

    if (!currentUser) {
        return (
            <div className="auth-controls">
                <button type="button" className="secondary-button" onClick={() => navigate("/login")}>
                    로그인
                </button>
            </div>
        );
    }

    return (
        <div className="auth-controls">
            <span className="auth-badge">{currentUser.username}</span>
            <button type="button" className="secondary-button" onClick={handleLogout}>
                로그아웃
            </button>
        </div>
    );
}
