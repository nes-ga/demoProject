import { httpRequest } from "./http";

export const getAdminBoards = async ({ page = 0, size = 10, keyword = "", sort = "id,DESC" } = {}) => {
    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
        sort
    });

    if (keyword.trim()) {
        params.set("keyword", keyword.trim());
    }

    return httpRequest(`/admin/boards?${params.toString()}`);
};

export const getAdminBoardDetail = async (id) => {
    return httpRequest(`/admin/boards/${id}`);
};

export const deleteAdminBoard = async (id) => {
    await httpRequest(`/admin/boards/${id}`, {
        method: "DELETE"
    });
};

export const deleteAdminComment = async (id) => {
    await httpRequest(`/admin/comments/${id}`, {
        method: "DELETE"
    });
};

export const getAdminUsers = async ({ page = 0, size = 10, keyword = "" } = {}) => {
    const params = new URLSearchParams({
        page: String(page),
        size: String(size)
    });

    if (keyword.trim()) {
        params.set("keyword", keyword.trim());
    }

    return httpRequest(`/admin/users?${params.toString()}`);
};

export const getPinnedAdminUsers = async () => {
    return httpRequest("/admin/users/admins");
};

export const updateAdminUserRole = async (id, role) => {
    await httpRequest(`/admin/users/${id}/role`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ role })
    });
};

export const deleteAdminUser = async (id) => {
    await httpRequest(`/admin/users/${id}`, {
        method: "DELETE"
    });
};
