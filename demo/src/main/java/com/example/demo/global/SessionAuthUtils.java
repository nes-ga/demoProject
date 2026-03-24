package com.example.demo.global;

import com.example.demo.dto.AuthUserResponse;
import com.example.demo.dto.SessionUser;
import jakarta.servlet.http.HttpSession;

public final class SessionAuthUtils {

    public static final String SESSION_USER_KEY = "LOGIN_USER";
    public static final String ADMIN_ROLE = "ADMIN";

    private SessionAuthUtils() {
    }

    public static SessionUser getOptionalUser(HttpSession session) {
        if (session == null) {
            return null;
        }

        Object sessionUser = session.getAttribute(SESSION_USER_KEY);
        if (sessionUser instanceof SessionUser user) {
            return user;
        }

        return null;
    }

    public static SessionUser getRequiredUser(HttpSession session) {
        SessionUser user = getOptionalUser(session);
        if (user != null) {
            return user;
        }

        throw new UnauthorizedException("Login is required.");
    }

    public static SessionUser getRequiredAdmin(HttpSession session) {
        SessionUser user = getRequiredUser(session);
        if (!isAdmin(user)) {
            throw new ForbiddenException("Admin access is required.");
        }

        return user;
    }

    public static boolean isAdmin(SessionUser user) {
        return user != null && ADMIN_ROLE.equalsIgnoreCase(user.getRole());
    }

    public static AuthUserResponse toResponse(SessionUser user) {
        return new AuthUserResponse(user.getId(), user.getUsername(), user.getRole());
    }
}
