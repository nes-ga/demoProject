const BASE_URL = "http://localhost:8080";
const SESSION_EXPIRED_EVENT = "app:session-expired";

export async function httpRequest(path, options = {}) {
    const response = await fetch(`${BASE_URL}${path}`, {
        credentials: "include",
        ...options
    });

    let payload = null;
    const contentType = response.headers.get("content-type") ?? "";

    if (response.status !== 204) {
        payload = contentType.includes("application/json")
            ? await response.json()
            : await response.text();
    }

    if (!response.ok) {
        if (response.status === 401 && shouldHandleSessionExpiry(path)) {
            window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
        }

        const message = payload?.message || payload?.error || "Request could not be completed.";
        const error = new Error(message);
        error.status = response.status;
        error.payload = payload;
        throw error;
    }

    return payload;
}

export function shouldHandleSessionExpiry(path) {
    return !["/auth/login", "/auth/signup", "/auth/me"].includes(path);
}

export function redirectToLogin() {
    const currentPath = `${window.location.pathname}${window.location.search}`;

    if (window.location.pathname === "/login") {
        return;
    }

    const loginUrl = new URL("/login", window.location.origin);
    if (currentPath && currentPath !== "/") {
        loginUrl.searchParams.set("redirect", currentPath);
    }

    window.location.assign(loginUrl.toString());
}

export { SESSION_EXPIRED_EVENT };
