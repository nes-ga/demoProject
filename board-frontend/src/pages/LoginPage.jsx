import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function LoginPage() {
    const [form, setForm] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { currentUser, authLoading, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const redirectPath = location.state?.from || "/";

    if (!authLoading && currentUser) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            await login(form);
            navigate(redirectPath, { replace: true });
        } catch (requestError) {
            setError(requestError.message || "로그인에 실패했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page-shell">
            <section className="board-page login-card">
                <div className="page-header">
                    <div>
                        <p className="eyebrow">Auth</p>
                        <h1>로그인</h1>
                        <p className="page-description">
                            로그인하면 글 작성과 댓글 작성처럼 변경이 필요한 작업을 계속할 수 있습니다.
                        </p>
                    </div>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <input
                        className="text-input"
                        placeholder="아이디"
                        value={form.username}
                        onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                    />
                    <input
                        className="text-input"
                        type="password"
                        placeholder="비밀번호"
                        value={form.password}
                        onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    />
                    {error ? <div className="empty-state error-state">{error}</div> : null}
                    <button type="submit" className="primary-button" disabled={submitting}>
                        {submitting ? "로그인 중..." : "로그인"}
                    </button>
                </form>

                <Link className="back-link" to="/">목록으로 돌아가기</Link>
            </section>
        </div>
    );
}
