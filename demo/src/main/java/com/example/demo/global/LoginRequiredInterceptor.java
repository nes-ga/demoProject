package com.example.demo.global;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class LoginRequiredInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        if ("GET".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        if ("PATCH".equalsIgnoreCase(request.getMethod()) && request.getRequestURI().endsWith("/view")) {
            return true;
        }

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute(SessionAuthUtils.SESSION_USER_KEY) == null) {
            throw new UnauthorizedException("로그인이 필요합니다.");
        }

        return true;
    }
}
