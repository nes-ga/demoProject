const BASE_URL = "http://localhost:8080";

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
        const message = payload?.message || payload?.error || "요청을 처리하지 못했습니다.";
        const error = new Error(message);
        error.status = response.status;
        error.payload = payload;
        throw error;
    }

    return payload;
}
