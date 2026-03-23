import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    deleteAdminBoard,
    deleteAdminComment,
    getAdminBoardDetail,
    getAdminBoards,
    getAdminUsers,
    updateAdminUserRole
} from "../api/adminApi";
import AuthControls from "../components/AuthControls";

const MENU = {
    BOARDS: "boards",
    USERS: "users"
};

export default function AdminPage() {
    const [activeMenu, setActiveMenu] = useState(MENU.BOARDS);

    const [boards, setBoards] = useState([]);
    const [boardPage, setBoardPage] = useState(0);
    const [boardSize, setBoardSize] = useState(10);
    const [boardSort, setBoardSort] = useState("id,DESC");
    const [boardKeywordInput, setBoardKeywordInput] = useState("");
    const [boardKeyword, setBoardKeyword] = useState("");
    const [boardTotalPages, setBoardTotalPages] = useState(0);
    const [boardTotalElements, setBoardTotalElements] = useState(0);
    const [selectedBoardId, setSelectedBoardId] = useState(null);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [boardLoading, setBoardLoading] = useState(true);
    const [boardDetailLoading, setBoardDetailLoading] = useState(false);
    const [boardError, setBoardError] = useState("");
    const [boardDetailError, setBoardDetailError] = useState("");
    const [boardActionMessage, setBoardActionMessage] = useState("");

    const [users, setUsers] = useState([]);
    const [userPage, setUserPage] = useState(0);
    const [userSize, setUserSize] = useState(10);
    const [userKeywordInput, setUserKeywordInput] = useState("");
    const [userKeyword, setUserKeyword] = useState("");
    const [userTotalPages, setUserTotalPages] = useState(0);
    const [userTotalElements, setUserTotalElements] = useState(0);
    const [userLoading, setUserLoading] = useState(true);
    const [userError, setUserError] = useState("");
    const [userActionMessage, setUserActionMessage] = useState("");
    const [roleUpdatingId, setRoleUpdatingId] = useState(null);

    useEffect(() => {
        let ignore = false;

        const loadBoards = async () => {
            setBoardLoading(true);
            setBoardError("");

            try {
                const data = await getAdminBoards({
                    page: boardPage,
                    size: boardSize,
                    keyword: boardKeyword,
                    sort: boardSort
                });

                if (ignore) {
                    return;
                }

                const nextBoards = data.content ?? [];
                setBoards(nextBoards);
                setBoardTotalPages(data.totalPages ?? 0);
                setBoardTotalElements(data.totalElements ?? 0);

                if (!nextBoards.length) {
                    setSelectedBoardId(null);
                    setSelectedBoard(null);
                    return;
                }

                setSelectedBoardId((current) => (
                    nextBoards.some((board) => board.id === current) ? current : nextBoards[0].id
                ));
            } catch (requestError) {
                if (!ignore) {
                    setBoardError(requestError.message || "Failed to load boards.");
                }
            } finally {
                if (!ignore) {
                    setBoardLoading(false);
                }
            }
        };

        loadBoards();

        return () => {
            ignore = true;
        };
    }, [boardKeyword, boardPage, boardSize, boardSort]);

    useEffect(() => {
        if (!selectedBoardId) {
            return;
        }

        let ignore = false;

        const loadBoardDetail = async () => {
            setBoardDetailLoading(true);
            setBoardDetailError("");

            try {
                const response = await getAdminBoardDetail(selectedBoardId);

                if (!ignore) {
                    setSelectedBoard(response.data);
                }
            } catch (requestError) {
                if (!ignore) {
                    setSelectedBoard(null);
                    setBoardDetailError(requestError.message || "Failed to load board detail.");
                }
            } finally {
                if (!ignore) {
                    setBoardDetailLoading(false);
                }
            }
        };

        loadBoardDetail();

        return () => {
            ignore = true;
        };
    }, [selectedBoardId]);

    useEffect(() => {
        let ignore = false;

        const loadUsers = async () => {
            setUserLoading(true);
            setUserError("");

            try {
                const data = await getAdminUsers({
                    page: userPage,
                    size: userSize,
                    keyword: userKeyword
                });

                if (!ignore) {
                    setUsers(data.content ?? []);
                    setUserTotalPages(data.totalPages ?? 0);
                    setUserTotalElements(data.totalElements ?? 0);
                }
            } catch (requestError) {
                if (!ignore) {
                    setUserError(requestError.message || "Failed to load users.");
                }
            } finally {
                if (!ignore) {
                    setUserLoading(false);
                }
            }
        };

        loadUsers();

        return () => {
            ignore = true;
        };
    }, [userKeyword, userPage, userSize]);

    const handleBoardSearch = () => {
        setBoardPage(0);
        setBoardKeyword(boardKeywordInput.trim());
    };

    const handleUserSearch = () => {
        setUserPage(0);
        setUserKeyword(userKeywordInput.trim());
    };

    const refreshSelectedBoard = async () => {
        if (!selectedBoardId) {
            return;
        }

        const response = await getAdminBoardDetail(selectedBoardId);
        setSelectedBoard(response.data);
    };

    const refreshUsers = async () => {
        const data = await getAdminUsers({
            page: userPage,
            size: userSize,
            keyword: userKeyword
        });

        setUsers(data.content ?? []);
        setUserTotalPages(data.totalPages ?? 0);
        setUserTotalElements(data.totalElements ?? 0);
    };

    const reloadBoardsAfterDelete = async (deletedBoardId) => {
        const data = await getAdminBoards({
            page: boardPage,
            size: boardSize,
            keyword: boardKeyword,
            sort: boardSort
        });
        const nextBoards = data.content ?? [];

        setBoards(nextBoards);
        setBoardTotalPages(data.totalPages ?? 0);
        setBoardTotalElements(data.totalElements ?? 0);

        const fallbackId = nextBoards.find((board) => board.id !== deletedBoardId)?.id ?? nextBoards[0]?.id ?? null;
        setSelectedBoardId(fallbackId);
        if (!fallbackId) {
            setSelectedBoard(null);
        }
    };

    const handleDeleteBoard = async () => {
        if (!selectedBoard) {
            return;
        }

        const shouldDelete = window.confirm(`Delete board #${selectedBoard.id}?`);
        if (!shouldDelete) {
            return;
        }

        try {
            await deleteAdminBoard(selectedBoard.id);
            setBoardActionMessage(`Deleted board #${selectedBoard.id}.`);
            setBoardDetailError("");
            await reloadBoardsAfterDelete(selectedBoard.id);
        } catch (requestError) {
            setBoardDetailError(requestError.message || "Failed to delete the board.");
        }
    };

    const handleDeleteComment = async (commentId) => {
        const shouldDelete = window.confirm(`Delete comment #${commentId}?`);
        if (!shouldDelete) {
            return;
        }

        try {
            await deleteAdminComment(commentId);
            setBoardActionMessage(`Deleted comment #${commentId}.`);
            setBoardDetailError("");
            await refreshSelectedBoard();
        } catch (requestError) {
            setBoardDetailError(requestError.message || "Failed to delete the comment.");
        }
    };

    const handleUserRoleChange = async (user) => {
        const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";
        const shouldUpdate = window.confirm(`Change ${user.username} to ${nextRole}?`);
        if (!shouldUpdate) {
            return;
        }

        setRoleUpdatingId(user.id);
        setUserError("");

        try {
            await updateAdminUserRole(user.id, nextRole);
            setUserActionMessage(`Updated ${user.username} to ${nextRole}.`);
            await refreshUsers();
        } catch (requestError) {
            setUserError(requestError.message || "Failed to update the user role.");
        } finally {
            setRoleUpdatingId(null);
        }
    };

    return (
        <div className="page-shell admin-shell">
            <section className="board-page admin-page">
                <div className="page-header">
                    <div>
                        <p className="eyebrow">Admin</p>
                        <h1>Admin Console</h1>
                        <p className="page-description">
                            Use the sidebar to move between board moderation and user management.
                        </p>
                    </div>
                    <div className="header-actions">
                        <Link className="back-link" to="/">Open board</Link>
                        <AuthControls />
                    </div>
                </div>

                <div className="admin-frame">
                    <aside className="admin-sidebar">
                        <button
                            type="button"
                            className={`admin-menu-button ${activeMenu === MENU.BOARDS ? "is-active" : ""}`}
                            onClick={() => setActiveMenu(MENU.BOARDS)}
                        >
                            Boards
                        </button>
                        <button
                            type="button"
                            className={`admin-menu-button ${activeMenu === MENU.USERS ? "is-active" : ""}`}
                            onClick={() => setActiveMenu(MENU.USERS)}
                        >
                            Users
                        </button>
                    </aside>

                    <div className="admin-panel">
                        {activeMenu === MENU.BOARDS ? (
                            <section className="admin-content">
                                <div className="toolbar">
                                    <div className="search-group">
                                        <input
                                            className="text-input"
                                            placeholder="Search boards by title"
                                            value={boardKeywordInput}
                                            onChange={(event) => setBoardKeywordInput(event.target.value)}
                                            onKeyDown={(event) => {
                                                if (event.key === "Enter") {
                                                    handleBoardSearch();
                                                }
                                            }}
                                        />
                                        <button type="button" className="secondary-button" onClick={handleBoardSearch}>
                                            Search
                                        </button>
                                    </div>

                                    <div className="filter-group">
                                        <select
                                            className="select-input"
                                            value={boardSort}
                                            onChange={(event) => {
                                                setBoardSort(event.target.value);
                                                setBoardPage(0);
                                            }}
                                        >
                                            <option value="id,DESC">Newest</option>
                                            <option value="viewCount,DESC">Most viewed</option>
                                            <option value="title,ASC">Title A-Z</option>
                                            <option value="createdAt,ASC">Oldest</option>
                                        </select>
                                        <select
                                            className="select-input"
                                            value={boardSize}
                                            onChange={(event) => {
                                                setBoardSize(Number(event.target.value));
                                                setBoardPage(0);
                                            }}
                                        >
                                            <option value={10}>10 rows</option>
                                            <option value={20}>20 rows</option>
                                            <option value={50}>50 rows</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="board-summary">
                                    <span>Total boards: {boardTotalElements}</span>
                                    {boardActionMessage ? <span>{boardActionMessage}</span> : null}
                                </div>

                                <div className="admin-layout">
                                    <section className="admin-list-panel">
                                        <div className="section-header">
                                            <h2>Board List</h2>
                                            <span>{boardLoading ? "Loading..." : `${boards.length} rows`}</span>
                                        </div>

                                        {boardLoading ? <div className="empty-state">Loading boards...</div> : null}
                                        {boardError ? <div className="empty-state error-state">{boardError}</div> : null}

                                        {!boardLoading && !boardError ? (
                                            boards.length ? (
                                                <div className="admin-board-list">
                                                    {boards.map((board) => (
                                                        <button
                                                            key={board.id}
                                                            type="button"
                                                            className={`admin-board-row ${selectedBoardId === board.id ? "is-selected" : ""}`}
                                                            onClick={() => {
                                                                setSelectedBoardId(board.id);
                                                                setBoardActionMessage("");
                                                            }}
                                                        >
                                                            <strong>{board.title}</strong>
                                                            <span>#{board.id}</span>
                                                            <span>{board.writer || "Anonymous"}</span>
                                                            <span>Views {board.viewCount ?? 0}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="empty-state">No boards matched your search.</div>
                                            )
                                        ) : null}

                                        <div className="pagination">
                                            <button
                                                type="button"
                                                className="secondary-button"
                                                onClick={() => setBoardPage((current) => current - 1)}
                                                disabled={boardPage === 0}
                                            >
                                                Prev
                                            </button>
                                            <span className="auth-muted">
                                                {boardTotalPages === 0 ? "0 / 0" : `${boardPage + 1} / ${boardTotalPages}`}
                                            </span>
                                            <button
                                                type="button"
                                                className="secondary-button"
                                                onClick={() => setBoardPage((current) => current + 1)}
                                                disabled={boardPage >= boardTotalPages - 1 || boardTotalPages === 0}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </section>

                                    <section className="admin-detail-panel">
                                        <div className="section-header">
                                            <h2>Board Detail</h2>
                                            {selectedBoard ? (
                                                <button type="button" className="secondary-button danger-fill" onClick={handleDeleteBoard}>
                                                    Delete board
                                                </button>
                                            ) : null}
                                        </div>

                                        {boardDetailLoading ? <div className="empty-state">Loading board detail...</div> : null}
                                        {boardDetailError ? <div className="empty-state error-state">{boardDetailError}</div> : null}

                                        {!boardDetailLoading && !boardDetailError && selectedBoard ? (
                                            <div className="admin-detail-stack">
                                                <div className="detail-content">
                                                    <div className="detail-header">
                                                        <p className="eyebrow">Post #{selectedBoard.id}</p>
                                                        <h2>{selectedBoard.title}</h2>
                                                        <div className="detail-meta">
                                                            <span>Writer {selectedBoard.writer || "Anonymous"}</span>
                                                            <span>Views {selectedBoard.viewCount ?? 0}</span>
                                                            <span>{formatDate(selectedBoard.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="admin-content-body">{selectedBoard.content}</div>
                                                </div>

                                                <div className="comment-section">
                                                    <div className="section-header">
                                                        <h2>Comments</h2>
                                                        <span>{countComments(selectedBoard.comments)} total</span>
                                                    </div>
                                                    {selectedBoard.comments?.length ? (
                                                        <AdminCommentTree
                                                            comments={selectedBoard.comments}
                                                            onDeleteComment={handleDeleteComment}
                                                        />
                                                    ) : (
                                                        <div className="empty-state">No comments on this board.</div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : null}

                                        {!boardDetailLoading && !boardDetailError && !selectedBoard ? (
                                            <div className="empty-state">Select a board from the list.</div>
                                        ) : null}
                                    </section>
                                </div>
                            </section>
                        ) : (
                            <section className="admin-content">
                                <div className="toolbar">
                                    <div className="search-group">
                                        <input
                                            className="text-input"
                                            placeholder="Search users by username"
                                            value={userKeywordInput}
                                            onChange={(event) => setUserKeywordInput(event.target.value)}
                                            onKeyDown={(event) => {
                                                if (event.key === "Enter") {
                                                    handleUserSearch();
                                                }
                                            }}
                                        />
                                        <button type="button" className="secondary-button" onClick={handleUserSearch}>
                                            Search
                                        </button>
                                    </div>

                                    <div className="filter-group">
                                        <select
                                            className="select-input"
                                            value={userSize}
                                            onChange={(event) => {
                                                setUserSize(Number(event.target.value));
                                                setUserPage(0);
                                            }}
                                        >
                                            <option value={10}>10 rows</option>
                                            <option value={20}>20 rows</option>
                                            <option value={50}>50 rows</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="board-summary">
                                    <span>Total users: {userTotalElements}</span>
                                    {userActionMessage ? <span>{userActionMessage}</span> : null}
                                </div>

                                {userLoading ? <div className="empty-state">Loading users...</div> : null}
                                {userError ? <div className="empty-state error-state">{userError}</div> : null}

                                {!userLoading && !userError ? (
                                    users.length ? (
                                        <div className="admin-user-grid">
                                            {users.map((user) => {
                                                const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";
                                                return (
                                                    <article key={user.id} className="admin-user-card">
                                                        <div className="comment-card-header">
                                                            <strong>{user.username}</strong>
                                                            <span>{formatDate(user.createdAt)}</span>
                                                        </div>
                                                        <div className="board-summary">
                                                            <span>User #{user.id}</span>
                                                            <span className={`role-chip role-${user.role?.toLowerCase()}`}>
                                                                {user.role}
                                                            </span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="secondary-button"
                                                            onClick={() => handleUserRoleChange(user)}
                                                            disabled={roleUpdatingId === user.id}
                                                        >
                                                            {roleUpdatingId === user.id ? "Updating..." : `Set ${nextRole}`}
                                                        </button>
                                                    </article>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="empty-state">No users matched your search.</div>
                                    )
                                ) : null}

                                <div className="pagination">
                                    <button
                                        type="button"
                                        className="secondary-button"
                                        onClick={() => setUserPage((current) => current - 1)}
                                        disabled={userPage === 0}
                                    >
                                        Prev
                                    </button>
                                    <span className="auth-muted">
                                        {userTotalPages === 0 ? "0 / 0" : `${userPage + 1} / ${userTotalPages}`}
                                    </span>
                                    <button
                                        type="button"
                                        className="secondary-button"
                                        onClick={() => setUserPage((current) => current + 1)}
                                        disabled={userPage >= userTotalPages - 1 || userTotalPages === 0}
                                    >
                                        Next
                                    </button>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

function AdminCommentTree({ comments, depth = 0, onDeleteComment }) {
    return (
        <div className="comment-tree">
            {comments.map((comment) => (
                <div key={comment.id} className="comment-card" style={{ marginLeft: `${depth * 16}px` }}>
                    <div className="comment-card-header">
                        <strong>{comment.writer || "Anonymous"}</strong>
                        <span>{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="comment-content">{comment.content}</p>
                    <div className="comment-actions">
                        <span className="auth-muted">Comment #{comment.id}</span>
                        <button
                            type="button"
                            className="comment-action-button danger-action"
                            onClick={() => onDeleteComment(comment.id)}
                        >
                            Delete comment
                        </button>
                    </div>
                    {comment.children?.length ? (
                        <AdminCommentTree
                            comments={comment.children}
                            depth={depth + 1}
                            onDeleteComment={onDeleteComment}
                        />
                    ) : null}
                </div>
            ))}
        </div>
    );
}

function countComments(comments = []) {
    return comments.reduce((count, comment) => count + 1 + countComments(comment.children ?? []), 0);
}

function formatDate(value) {
    if (!value) {
        return "No date";
    }

    return new Intl.DateTimeFormat("ko-KR", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(new Date(value));
}
