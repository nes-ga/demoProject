const BASE_URL = "http://localhost:8080";

export const getBoards = async ({ page = 0, size = 10, keyword = "", sort = "id,DESC" } = {}) => {
    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
        sort
    });

    if (keyword.trim()) {
        params.set("keyword", keyword.trim());
    }

    const res = await fetch(`${BASE_URL}/boards?${params.toString()}`);
    return res.json();
};

export const getBoardDetail = async (id) => {
    const res = await fetch(`${BASE_URL}/boards/${id}`);
    return res.json();
};

export const increaseBoardView = async (id) => {
    await fetch(`${BASE_URL}/boards/${id}/view`, {
        method: "PATCH"
    });
};

export const createComment = async (boardId, data) => {
    await fetch(`${BASE_URL}/boards/${boardId}/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
};
