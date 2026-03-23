import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { signup } from "../api/authApi";
import { useAuth } from "../auth/useAuth";

export default function SignupPage() {
    const [form, setForm] = useState({
        username: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { currentUser, authLoading } = useAuth();
    const navigate = useNavigate();

    if (!authLoading && currentUser) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setSubmitting(true);

        try {
            await signup({
                username: form.username,
                password: form.password
            });
            navigate("/login", {
                replace: true,
                state: {
                    signupSuccessMessage: "Account created. Please log in."
                }
            });
        } catch (requestError) {
            setError(requestError.message || "Sign up failed.");
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
                        <h1>Create Account</h1>
                        <p className="page-description">
                            New accounts are created with the default USER role.
                        </p>
                    </div>
                </div>

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
                    <input
                        className="text-input"
                        type="password"
                        placeholder="Confirm password"
                        value={form.confirmPassword}
                        onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                    />
                    {error ? <div className="empty-state error-state">{error}</div> : null}
                    <button type="submit" className="primary-button" disabled={submitting}>
                        {submitting ? "Creating account..." : "Sign up"}
                    </button>
                </form>

                <div className="inline-actions">
                    <Link className="back-link" to="/login">Back to login</Link>
                    <Link className="back-link" to="/">Back to board</Link>
                </div>
            </section>
        </div>
    );
}
