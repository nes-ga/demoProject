import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createBoard } from "../api/boardApi";
import { useAuth } from "../auth/useAuth";
import AuthControls from "../components/AuthControls";

export default function BoardCreate() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const handleSubmit = async () => {
        setSubmitting(true);
        setError("");

        try {
            const created = await createBoard({ title, content });
            navigate(`/boards/${created.id}`, {
                state: { skipInitialViewIncrease: true }
            });
        } catch (requestError) {
            setError(requestError.message || "게시글을 작성하지 못했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page-shell">
            <section className="board-page detail-page">
                <div className="page-header">
                    <div>
                        <p className="eyebrow">Write</p>
                        <h1>게시글 작성</h1>
                        <p className="page-description">
                            작성자는 현재 로그인한 사용자로 자동 입력됩니다. 현재 작성자: {currentUser?.username}
                        </p>
                    </div>
                    <AuthControls />
                </div>

                <div className="comment-form">
                    <input
                        className="text-input"
                        placeholder="제목"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                    />

                    <textarea
                        className="text-area"
                        placeholder="내용"
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                    />

                    {error ? <div className="empty-state error-state">{error}</div> : null}

                    <div className="inline-actions">
                        <button type="button" className="primary-button" onClick={handleSubmit} disabled={submitting}>
                            {submitting ? "작성 중.." : "작성"}
                        </button>
                        <Link className="back-link" to="/">취소</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
