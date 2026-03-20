import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createComment, getBoardDetail, increaseBoardView } from "../api/boardApi";

export default function BoardDetail() {
    const { id } = useParams();
    const [board, setBoard] = useState(null);
    const [content, setContent] = useState("");
    const [writer, setWriter] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        const loadBoard = async () => {
            setLoading(true);
            setError("");

            try {
                if (shouldIncreaseView(id)) {
                    await increaseBoardView(id);
                    markViewLoaded(id);
                }
                const data = await getBoardDetail(id);

                if (!ignore) {
                    setBoard(data.data);
                }
            } catch {
                if (!ignore) {
                    setError("게시글을 불러오지 못했습니다.");
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadBoard();

        return () => {
            ignore = true;
        };
    }, [id]);

    const handleCreate = async () => {
        if (!writer.trim() || !content.trim()) {
            return;
        }

        await createComment(id, { content, writer });
        const data = await getBoardDetail(id);
        setBoard(data.data);
        setWriter("");
        setContent("");
    };

    if (loading) {
        return <div className="page-shell"><div className="empty-state">게시글을 불러오는 중입니다.</div></div>;
    }

    if (error) {
        return <div className="page-shell"><div className="empty-state error-state">{error}</div></div>;
    }

    if (!board) {
        return <div className="page-shell"><div className="empty-state">게시글이 없습니다.</div></div>;
    }

    return (
        <div className="page-shell">
            <section className="board-page detail-page">
                <div className="detail-top">
                    <Link className="back-link" to="/">목록으로 돌아가기</Link>
                </div>

                <div className="detail-header">
                    <p className="eyebrow">Post #{board.id}</p>
                    <h1>{board.title}</h1>
                    <div className="detail-meta">
                        <span>작성자 {board.writer || "익명"}</span>
                        <span>조회 {board.viewCount ?? 0}</span>
                        <span>{formatDate(board.createdAt)}</span>
                    </div>
                </div>

                <article className="detail-content">
                    {board.content}
                </article>

                <section className="comment-section">
                    <div className="section-header">
                        <h2>댓글</h2>
                        <span>{board.comments?.length ?? 0}개의 상위 댓글</span>
                    </div>

                    {board.comments?.length ? (
                        <CommentTree comments={board.comments} />
                    ) : (
                        <div className="empty-state">아직 댓글이 없습니다.</div>
                    )}
                </section>

                <section className="comment-form">
                    <h2>댓글 작성</h2>
                    <input
                        className="text-input"
                        placeholder="작성자"
                        value={writer}
                        onChange={(event) => setWriter(event.target.value)}
                    />
                    <textarea
                        className="text-area"
                        placeholder="내용을 입력해 주세요"
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                    />
                    <button type="button" className="primary-button" onClick={handleCreate}>
                        작성
                    </button>
                </section>
            </section>
        </div>
    );
}

function CommentTree({ comments, depth = 0 }) {
    if (!comments) return null;

    return (
        <div className="comment-tree">
            {comments.map((comment) => (
                <div
                    key={comment.id}
                    className="comment-card"
                    style={{ marginLeft: `${depth * 20}px` }}
                >
                    <div className="comment-card-header">
                        <strong>{comment.writer || "익명"}</strong>
                        <span>{formatDate(comment.createdAt)}</span>
                    </div>
                    <p>{comment.content}</p>

                    {comment.children && comment.children.length > 0 && (
                        <CommentTree comments={comment.children} depth={depth + 1} />
                    )}
                </div>
            ))}
        </div>
    );
}

function formatDate(value) {
    if (!value) {
        return "날짜 정보 없음";
    }

    return new Intl.DateTimeFormat("ko-KR", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(new Date(value));
}

function shouldIncreaseView(id) {
    const key = getViewStorageKey(id);
    const lastViewedAt = Number(sessionStorage.getItem(key));

    if (!lastViewedAt) {
        return true;
    }

    return Date.now() - lastViewedAt > 2000;
}

function markViewLoaded(id) {
    sessionStorage.setItem(getViewStorageKey(id), String(Date.now()));
}

function getViewStorageKey(id) {
    return `board-viewed-${id}`;
}
