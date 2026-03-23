import { httpRequest } from "./http";

const JSON_HEADERS = {
    "Content-Type": "application/json"
};

export const login = async (credentials) => {
    const response = await httpRequest("/auth/login", {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(credentials)
    });

    return response.data;
};

export const signup = async (payload) => {
    await httpRequest("/auth/signup", {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(payload)
    });
};

export const logout = async () => {
    await httpRequest("/auth/logout", {
        method: "POST"
    });
};

export const getSessionUser = async () => {
    const response = await httpRequest("/auth/me");
    return response.data;
};

export const updatePassword = async (payload) => {
    await httpRequest("/auth/password", {
        method: "PATCH",
        headers: JSON_HEADERS,
        body: JSON.stringify(payload)
    });
};
