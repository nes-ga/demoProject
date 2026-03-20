package com.example.demo.service;

import com.example.demo.domain.Member;
import com.example.demo.dto.AuthUserResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.SessionUser;
import com.example.demo.global.SessionAuthUtils;
import com.example.demo.global.UnauthorizedException;
import com.example.demo.repository.MemberMapper;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final MemberMapper memberMapper;
    private final PasswordEncoder passwordEncoder;

    public AuthUserResponse login(LoginRequest request, HttpSession session) {
        Member member = memberMapper.findByUsername(request.getUsername());

        if (member == null || !passwordEncoder.matches(request.getPassword(), member.getPasswordHash())) {
            throw new UnauthorizedException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        SessionUser sessionUser = new SessionUser(member.getId(), member.getUsername(), member.getRole());
        session.setAttribute(SessionAuthUtils.SESSION_USER_KEY, sessionUser);

        return SessionAuthUtils.toResponse(sessionUser);
    }

    public AuthUserResponse getCurrentUser(HttpSession session) {
        SessionUser user = SessionAuthUtils.getRequiredUser(session);
        return SessionAuthUtils.toResponse(user);
    }

    public void logout(HttpSession session) {
        session.invalidate();
    }
}
