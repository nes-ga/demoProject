import { httpRequest } from "./http";

const JSON_HEADERS = {
    "Content-Type": "application/json"
};

export const getBoards = async ({ page = 0, size = 10, keyword = "", sort = "id,DESC" } = {}) => {
    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
        sort
    });

    if (keyword.trim()) {
        params.set("keyword", keyword.trim());
    }

    return httpRequest(`/boards?${params.toString()}`);
};

export const getBoardDetail = async (id) => {
    return httpRequest(`/boards/${id}`);
};

export const increaseBoardView = async (id) => {
    await httpRequest(`/boards/${id}/view`, {
        method: "PATCH"
    });
};

export const createBoard = async (data) => {
    return httpRequest("/boards", {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(data)
    });
};

export const createComment = async (boardId, data) => {
    await httpRequest(`/boards/${boardId}/comments`, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(data)
    });
};

export const updateComment = async (boardId, commentId, data) => {
    await httpRequest(`/boards/${boardId}/comments/${commentId}`, {
        method: "PUT",
        headers: JSON_HEADERS,
        body: JSON.stringify(data)
    });
};

export const deleteComment = async (boardId, commentId) => {
    await httpRequest(`/boards/${boardId}/comments/${commentId}`, {
        method: "DELETE"
    });
};
