import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getBoards } from "../api/boardApi";
import AuthControls from "../components/AuthControls";

export default function BoardList() {
    const [boards, setBoards] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [size, setSize] = useState(10);
    const [sort, setSort] = useState("id,DESC");
    const [keywordInput, setKeywordInput] = useState("");
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        let ignore = false;

        const loadBoards = async () => {
            setLoading(true);
            setError("");

            try {
                const data = await getBoards({ page, size, keyword, sort });

                if (ignore) {
                    return;
                }

                setBoards(data.content ?? []);
                setTotalPages(data.totalPages ?? 0);
                setTotalElements(data.totalElements ?? 0);
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

        loadBoards();

        return () => {
            ignore = true;
        };
    }, [page, size, keyword, sort]);

    const handleSearch = () => {
        setPage(0);
        setKeyword(keywordInput);
    };

    const handleKeywordKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        const startPage = Math.max(0, page - 2);
        const endPage = Math.min(totalPages, startPage + 5);

        for (let index = startPage; index < endPage; index += 1) {
            pages.push(
                <button
                    key={index}
                    type="button"
                    className={`page-button ${page === index ? "is-active" : ""}`}
                    onClick={() => setPage(index)}
                >
                    {index + 1}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="page-shell">
            <section className="board-page">
                <div className="page-header">
                    <div>
                        <p className="eyebrow">Board</p>
                        <h1>게시글 목록</h1>
                        <p className="page-description">
                            검색과 정렬로 원하는 글을 빠르게 찾고, 로그인 상태를 바로 확인할 수 있게 정리했습니다.
                        </p>
                    </div>
                    <div className="header-actions">
                        <AuthControls />
                        <button
                            type="button"
                            className="primary-button"
                            onClick={() => navigate("/create")}
                        >
                            게시글 작성
                        </button>
                    </div>
                </div>

                <div className="toolbar">
                    <div className="search-group">
                        <input
                            className="text-input"
                            placeholder="제목으로 검색"
                            value={keywordInput}
                            onChange={(event) => setKeywordInput(event.target.value)}
                            onKeyDown={handleKeywordKeyDown}
                        />
                        <button type="button" className="secondary-button" onClick={handleSearch}>
                            검색
                        </button>
                    </div>

                    <div className="filter-group">
                        <select
                            className="select-input"
                            value={sort}
                            onChange={(event) => {
                                setSort(event.target.value);
                                setPage(0);
                            }}
                        >
                            <option value="id,DESC">최신순</option>
                            <option value="viewCount,DESC">조회수 높은 순</option>
                            <option value="title,ASC">제목 이름차순</option>
                            <option value="createdAt,ASC">오래된 순</option>
                        </select>

                        <select
                            className="select-input"
                            value={size}
                            onChange={(event) => {
                                setSize(Number(event.target.value));
                                setPage(0);
                            }}
                        >
                            <option value={5}>5개씩 보기</option>
                            <option value={10}>10개씩 보기</option>
                            <option value={20}>20개씩 보기</option>
                        </select>
                    </div>
                </div>

                <div className="board-summary">
                    <span>총 {totalElements}개의 게시글</span>
                    {keyword ? <span>"{keyword}" 검색 결과</span> : <span>전체 목록</span>}
                </div>

                {loading ? <div className="empty-state">게시글을 불러오는 중입니다.</div> : null}
                {error ? <div className="empty-state error-state">{error}</div> : null}

                {!loading && !error ? (
                    boards.length > 0 ? (
                        <div className="board-list">
                            {boards.map((board) => (
                                <article key={board.id} className="board-card">
                                    <div className="board-card-main">
                                        <Link className="board-link" to={`/boards/${board.id}`}>
                                            {board.title}
                                        </Link>
                                        <p className="board-card-subtitle">
                                            게시글 번호 #{board.id} · 작성자 {board.writer || "익명"}
                                        </p>
                                    </div>
                                    <div className="board-meta">
                                        <span>조회 {board.viewCount ?? 0}</span>
                                        <span>{formatDate(board.createdAt)}</span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">조건에 맞는 게시글이 없습니다.</div>
                    )
                ) : null}

                <div className="pagination">
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() => setPage((current) => current - 1)}
                        disabled={page === 0}
                    >
                        이전
                    </button>

                    <div className="page-numbers">{renderPageNumbers()}</div>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() => setPage((current) => current + 1)}
                        disabled={page >= totalPages - 1 || totalPages === 0}
                    >
                        다음
                    </button>
                </div>
            </section>
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
