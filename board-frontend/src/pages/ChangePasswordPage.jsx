import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updatePassword } from "../api/authApi";
import AuthControls from "../components/AuthControls";

export default function ChangePasswordPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (form.newPassword.trim().length < 8) {
            setError("새 비밀번호는 8자 이상이어야 합니다.");
            return;
        }

        if (form.newPassword !== form.confirmPassword) {
            setError("새 비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        setSubmitting(true);

        try {
            await updatePassword({
                currentPassword: form.currentPassword,
                newPassword: form.newPassword
            });
            navigate("/mypage", {
                replace: true,
                state: { passwordChanged: true }
            });
        } catch (requestError) {
            setError(requestError.message || "비밀번호를 변경하지 못했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page-shell">
            <section className="board-page detail-page">
                <div className="page-header">
                    <div>
                        <p className="eyebrow">Security</p>
                        <h1>비밀번호 변경</h1>
                        <p className="page-description">
                            현재 비밀번호를 확인한 뒤 새 비밀번호로 변경합니다.
                        </p>
                    </div>
                    <AuthControls />
                </div>

                <form className="comment-form" onSubmit={handleSubmit}>
                    <input
                        className="text-input"
                        type="password"
                        placeholder="현재 비밀번호"
                        value={form.currentPassword}
                        onChange={(event) => setForm((current) => ({ ...current, currentPassword: event.target.value }))}
                    />
                    <input
                        className="text-input"
                        type="password"
                        placeholder="새 비밀번호"
                        value={form.newPassword}
                        onChange={(event) => setForm((current) => ({ ...current, newPassword: event.target.value }))}
                    />
                    <input
                        className="text-input"
                        type="password"
                        placeholder="새 비밀번호 확인"
                        value={form.confirmPassword}
                        onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                    />

                    {error ? <div className="empty-state error-state">{error}</div> : null}
                    {success ? <div className="empty-state success-state">{success}</div> : null}

                    <div className="inline-actions">
                        <button type="submit" className="primary-button" disabled={submitting}>
                            {submitting ? "변경 중..." : "비밀번호 변경"}
                        </button>
                        <Link className="back-link" to="/mypage">마이페이지로 돌아가기</Link>
                    </div>
                </form>
            </section>
        </div>
    );
}
