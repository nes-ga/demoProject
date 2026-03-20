package com.example.demo.global;

import com.example.demo.dto.AuthUserResponse;
import com.example.demo.dto.SessionUser;
import jakarta.servlet.http.HttpSession;

public final class SessionAuthUtils {

    public static final String SESSION_USER_KEY = "LOGIN_USER";

    private SessionAuthUtils() {
    }

    public static SessionUser getRequiredUser(HttpSession session) {
        Object sessionUser = session.getAttribute(SESSION_USER_KEY);
        if (sessionUser instanceof SessionUser user) {
            return user;
        }

        throw new UnauthorizedException("로그인이 필요합니다.");
    }

    public static AuthUserResponse toResponse(SessionUser user) {
        return new AuthUserResponse(user.getId(), user.getUsername(), user.getRole());
    }
}
