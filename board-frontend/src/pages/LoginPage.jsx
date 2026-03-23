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

    const redirectPath = location.state?.from
        || new URLSearchParams(location.search).get("redirect")
        || "/";
    const signupSuccessMessage = location.state?.signupSuccessMessage || "";

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
            setError(requestError.message || "Login failed.");
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
                        <h1>Login</h1>
                        <p className="page-description">
                            Sign in to create posts, write comments, and access protected actions.
                        </p>
                    </div>
                </div>

                {signupSuccessMessage ? (
                    <div className="empty-state">{signupSuccessMessage}</div>
                ) : null}

                <form className="login-form" onSubmit={handleSubmit}>
                    <input
                        className="text-input"
                        placeholder="Username"
                        value={form.username}
                        onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                    />
                    <input
                        className="text-input"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    />
                    {error ? <div className="empty-state error-state">{error}</div> : null}
                    <button type="submit" className="primary-button" disabled={submitting}>
                        {submitting ? "Signing in..." : "Login"}
                    </button>
                </form>

                <div className="inline-actions">
                    <Link className="back-link" to="/signup">Create account</Link>
                    <Link className="back-link" to="/">Back to board</Link>
                </div>
            </section>
        </div>
    );
}
