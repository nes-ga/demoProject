import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
    createComment,
    deleteComment,
    getBoardDetail,
    increaseBoardView,
    updateBoard,
    updateComment
} from "../api/boardApi";
import { useAuth } from "../auth/useAuth";
import AuthControls from "../components/AuthControls";

export default function BoardDetail() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [board, setBoard] = useState(null);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [boardEditOpen, setBoardEditOpen] = useState(false);
    const [boardEditTitle, setBoardEditTitle] = useState("");
    const [boardEditContent, setBoardEditContent] = useState("");
    const [boardEditError, setBoardEditError] = useState("");
    const [boardEditSubmitting, setBoardEditSubmitting] = useState(false);

    useEffect(() => {
        let ignore = false;

        const loadBoard = async () => {
            setLoading(true);
            setError("");

            try {
                const shouldSkipInitialViewIncrease = location.state?.skipInitialViewIncrease === true;

                if (shouldSkipInitialViewIncrease) {
                    clearSkipInitialViewIncrease();
                    markViewLoaded(id);
                } else if (beginViewIncrease(id)) {
                    try {
                        await increaseBoardView(id);
                    } catch (requestError) {
                        clearViewLoaded(id);
                        throw requestError;
                    }
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
    }, [id, location.state]);

    const refreshBoard = async () => {
        const data = await getBoardDetail(id);
        setBoard(data.data);
    };

    const moveToLogin = () => {
        navigate("/login", { state: { from: `/boards/${id}` } });
    };

    const canEditBoard = currentUser && (
        currentUser.username === board?.writer || currentUser.role === "ADMIN"
    );

    const openBoardEdit = () => {
        setBoardEditTitle(board?.title ?? "");
        setBoardEditContent(board?.content ?? "");
        setBoardEditError("");
        setBoardEditOpen(true);
    };

    const closeBoardEdit = () => {
        setBoardEditOpen(false);
        setBoardEditError("");
        setBoardEditTitle(board?.title ?? "");
        setBoardEditContent(board?.content ?? "");
    };

    const handleBoardUpdate = async () => {
        if (!boardEditTitle.trim()) {
            setBoardEditError("제목을 입력해 주세요.");
            return;
        }

        setBoardEditSubmitting(true);
        setBoardEditError("");

        try {
            await updateBoard(id, {
                title: boardEditTitle.trim(),
                content: boardEditContent.trim()
            });
            await refreshBoard();
            setBoardEditOpen(false);
        } catch (requestError) {
            if (requestError.status === 401) {
                moveToLogin();
                return;
            }

            setBoardEditError(requestError.message || "게시글을 수정하지 못했습니다.");
        } finally {
            setBoardEditSubmitting(false);
        }
    };

    const handleCreate = async () => {
        if (!content.trim()) {
            return;
        }

        setSubmitError("");

        try {
            await createComment(id, { content: content.trim() });
            await refreshBoard();
            setContent("");
        } catch (requestError) {
            if (requestError.status === 401) {
                moveToLogin();
                return;
            }

            setSubmitError(requestError.message || "댓글을 작성하지 못했습니다.");
        }
    };

    const handleReplyCreate = async (parentId, replyContent) => {
        try {
            await createComment(id, { content: replyContent, parentId });
            await refreshBoard();
            return { success: true };
        } catch (requestError) {
            if (requestError.status === 401) {
                moveToLogin();
                return { redirected: true };
            }

            return {
                error: requestError.message || "답글을 작성하지 못했습니다."
            };
        }
    };

    const handleCommentUpdate = async (commentId, nextContent) => {
        try {
            await updateComment(id, commentId, { content: nextContent });
            await refreshBoard();
            return { success: true };
        } catch (requestError) {
            if (requestError.status === 401) {
                moveToLogin();
                return { redirected: true };
            }

            return {
                error: requestError.message || "댓글을 수정하지 못했습니다."
            };
        }
    };

    const handleCommentDelete = async (commentId) => {
        try {
            await deleteComment(id, commentId);
            await refreshBoard();
            return { success: true };
        } catch (requestError) {
            if (requestError.status === 401) {
                moveToLogin();
                return { redirected: true };
            }

            return {
                error: requestError.message || "댓글을 삭제하지 못했습니다."
            };
        }
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
                <div className="page-header">
                    <div>
                        <Link className="back-link" to="/">목록으로 돌아가기</Link>
                    </div>
                    <AuthControls />
                </div>

                <div className="detail-header">
                    <p className="eyebrow">Post #{board.id}</p>
                    {boardEditOpen ? (
                        <input
                            className="text-input"
                            value={boardEditTitle}
                            onChange={(event) => setBoardEditTitle(event.target.value)}
                        />
                    ) : (
                        <h1>{board.title}</h1>
                    )}
                    <p className="board-card-subtitle">작성자 {board.writer || "익명"}</p>
                    <div className="detail-meta">
                        <span>작성자 {board.writer || "익명"}</span>
                        <span>조회 {board.viewCount ?? 0}</span>
                        <span>{formatDate(board.createdAt)}</span>
                    </div>
                    {canEditBoard ? (
                        <div className="inline-actions">
                            {boardEditOpen ? (
                                <>
                                    <button
                                        type="button"
                                        className="primary-button"
                                        onClick={handleBoardUpdate}
                                        disabled={boardEditSubmitting}
                                    >
                                        {boardEditSubmitting ? "수정 중..." : "수정 저장"}
                                    </button>
                                    <button
                                        type="button"
                                        className="secondary-button"
                                        onClick={closeBoardEdit}
                                        disabled={boardEditSubmitting}
                                    >
                                        취소
                                    </button>
                                </>
                            ) : (
                                <button type="button" className="secondary-button" onClick={openBoardEdit}>
                                    게시글 수정
                                </button>
                            )}
                        </div>
                    ) : null}
                    {boardEditError ? <div className="empty-state error-state">{boardEditError}</div> : null}
                </div>

                {boardEditOpen ? (
                    <section className="comment-form">
                        <textarea
                            className="text-area"
                            value={boardEditContent}
                            onChange={(event) => setBoardEditContent(event.target.value)}
                        />
                    </section>
                ) : (
                    <article className="detail-content">
                        {board.content}
                    </article>
                )}

                <section className="comment-section">
                    <div className="section-header">
                        <h2>댓글</h2>
                        <span>{board.comments?.length ?? 0}개의 상위 댓글</span>
                    </div>

                    {board.comments?.length ? (
                        <CommentTree
                            comments={board.comments}
                            currentUser={currentUser}
                            onReplyCreate={handleReplyCreate}
                            onCommentUpdate={handleCommentUpdate}
                            onCommentDelete={handleCommentDelete}
                            onLoginRequired={moveToLogin}
                        />
                    ) : (
                        <div className="empty-state">아직 댓글이 없습니다.</div>
                    )}
                </section>

                {currentUser ? (
                    <section className="comment-form">
                        <h2>댓글 작성</h2>
                        <p className="page-description">작성자는 {currentUser.username}로 자동 입력됩니다.</p>
                        <textarea
                            className="text-area"
                            placeholder="댓글 내용을 입력해 주세요"
                            value={content}
                            onChange={(event) => setContent(event.target.value)}
                        />
                        {submitError ? <div className="empty-state error-state">{submitError}</div> : null}
                        <button type="button" className="primary-button" onClick={handleCreate}>
                            댓글 등록
                        </button>
                    </section>
                ) : (
                    <div className="empty-state">
                        댓글을 작성하려면 로그인해 주세요.
                        <div className="inline-actions">
                            <button type="button" className="secondary-button" onClick={moveToLogin}>
                                로그인하러 가기
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}

function CommentTree({
    comments,
    depth = 0,
    currentUser,
    onReplyCreate,
    onCommentUpdate,
    onCommentDelete,
    onLoginRequired
}) {
    if (!comments) {
        return null;
    }

    return (
        <div className="comment-tree">
            {comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    depth={depth}
                    currentUser={currentUser}
                    onReplyCreate={onReplyCreate}
                    onCommentUpdate={onCommentUpdate}
                    onCommentDelete={onCommentDelete}
                    onLoginRequired={onLoginRequired}
                />
            ))}
        </div>
    );
}

function CommentItem({
    comment,
    depth,
    currentUser,
    onReplyCreate,
    onCommentUpdate,
    onCommentDelete,
    onLoginRequired
}) {
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [replyError, setReplyError] = useState("");
    const [replySubmitting, setReplySubmitting] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [editError, setEditError] = useState("");
    const [editSubmitting, setEditSubmitting] = useState(false);
    const [deleteError, setDeleteError] = useState("");
    const [deleteSubmitting, setDeleteSubmitting] = useState(false);

    const isOwner = currentUser?.username === comment.writer || currentUser?.role === "ADMIN";

    const handleReplySubmit = async () => {
        if (!currentUser) {
            onLoginRequired();
            return;
        }

        if (!replyContent.trim()) {
            setReplyError("답글 내용을 입력해 주세요.");
            return;
        }

        setReplySubmitting(true);
        setReplyError("");

        const result = await onReplyCreate(comment.id, replyContent.trim());

        setReplySubmitting(false);

        if (result?.success) {
            setReplyContent("");
            setReplyOpen(false);
            return;
        }

        if (result?.error) {
            setReplyError(result.error);
        }
    };

    const handleEditSubmit = async () => {
        if (!editContent.trim()) {
            setEditError("댓글 내용을 입력해 주세요.");
            return;
        }

        setEditSubmitting(true);
        setEditError("");
        setDeleteError("");

        const result = await onCommentUpdate(comment.id, editContent.trim());

        setEditSubmitting(false);

        if (result?.success) {
            setEditOpen(false);
            return;
        }

        if (result?.error) {
            setEditError(result.error);
        }
    };

    const handleDelete = async () => {
        const shouldDelete = window.confirm("이 댓글을 삭제할까요?");
        if (!shouldDelete) {
            return;
        }

        setDeleteSubmitting(true);
        setDeleteError("");
        setEditError("");

        const result = await onCommentDelete(comment.id);

        setDeleteSubmitting(false);

        if (result?.error) {
            setDeleteError(result.error);
        }
    };

    return (
        <div className="comment-card" style={{ marginLeft: `${depth * 20}px` }}>
            <div className="comment-card-header">
                <strong>{comment.writer || "익명"}</strong>
                <span>{formatDate(comment.createdAt)}</span>
            </div>

            {editOpen ? (
                <div className="reply-form">
                    <textarea
                        className="text-area reply-text-area"
                        value={editContent}
                        onChange={(event) => setEditContent(event.target.value)}
                    />
                    {editError ? <div className="empty-state error-state">{editError}</div> : null}
                    <div className="reply-actions">
                        <button
                            type="button"
                            className="primary-button"
                            onClick={handleEditSubmit}
                            disabled={editSubmitting}
                        >
                            {editSubmitting ? "수정 중..." : "수정 저장"}
                        </button>
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() => {
                                setEditOpen(false);
                                setEditError("");
                                setEditContent(comment.content);
                            }}
                            disabled={editSubmitting}
                        >
                            취소
                        </button>
                    </div>
                </div>
            ) : (
                <p className="comment-content">{comment.content}</p>
            )}

            <div className="comment-actions">
                <button
                    type="button"
                    className="comment-action-button"
                    onClick={() => {
                        if (!currentUser) {
                            onLoginRequired();
                            return;
                        }

                        setReplyError("");
                        setReplyOpen((prev) => !prev);
                    }}
                >
                    {replyOpen ? "답글 닫기" : "답글 달기"}
                </button>

                {isOwner ? (
                    <>
                        <button
                            type="button"
                            className="comment-action-button"
                            onClick={() => {
                                setEditOpen((prev) => !prev);
                                setEditError("");
                                setDeleteError("");
                                setEditContent(comment.content);
                            }}
                        >
                            {editOpen ? "수정 닫기" : "수정"}
                        </button>
                        <button
                            type="button"
                            className="comment-action-button danger-action"
                            onClick={handleDelete}
                            disabled={deleteSubmitting}
                        >
                            {deleteSubmitting ? "삭제 중..." : "삭제"}
                        </button>
                    </>
                ) : null}
            </div>

            {deleteError ? <div className="empty-state error-state">{deleteError}</div> : null}

            {replyOpen ? (
                <div className="reply-form">
                    <textarea
                        className="text-area reply-text-area"
                        placeholder={`${comment.writer || "익명"}님에게 답글을 남겨보세요`}
                        value={replyContent}
                        onChange={(event) => setReplyContent(event.target.value)}
                    />
                    {replyError ? <div className="empty-state error-state">{replyError}</div> : null}
                    <div className="reply-actions">
                        <button
                            type="button"
                            className="primary-button"
                            onClick={handleReplySubmit}
                            disabled={replySubmitting}
                        >
                            {replySubmitting ? "등록 중..." : "답글 등록"}
                        </button>
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() => {
                                setReplyOpen(false);
                                setReplyError("");
                                setReplyContent("");
                            }}
                            disabled={replySubmitting}
                        >
                            취소
                        </button>
                    </div>
                </div>
            ) : null}

            {comment.children && comment.children.length > 0 ? (
                <CommentTree
                    comments={comment.children}
                    depth={depth + 1}
                    currentUser={currentUser}
                    onReplyCreate={onReplyCreate}
                    onCommentUpdate={onCommentUpdate}
                    onCommentDelete={onCommentDelete}
                    onLoginRequired={onLoginRequired}
                />
            ) : null}
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

function beginViewIncrease(id) {
    const key = getViewStorageKey(id);
    const lastViewedAt = Number(sessionStorage.getItem(key));

    if (lastViewedAt && Date.now() - lastViewedAt <= 2000) {
        return false;
    }

    markViewLoaded(id);
    return true;
}

function markViewLoaded(id) {
    sessionStorage.setItem(getViewStorageKey(id), String(Date.now()));
}

function clearViewLoaded(id) {
    sessionStorage.removeItem(getViewStorageKey(id));
}

function getViewStorageKey(id) {
    return `board-viewed-${id}`;
}

function clearSkipInitialViewIncrease() {
    window.history.replaceState(
        { ...window.history.state, usr: null },
        document.title
    );
}
