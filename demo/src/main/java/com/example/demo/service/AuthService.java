package com.example.demo.service;

import com.example.demo.domain.Member;
import com.example.demo.dto.AuthUserResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.PasswordUpdateRequest;
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

    public void updatePassword(SessionUser user, PasswordUpdateRequest request) {
        Member member = memberMapper.findById(user.getId());

        if (member == null) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }

        if (!passwordEncoder.matches(request.getCurrentPassword(), member.getPasswordHash())) {
            throw new UnauthorizedException("현재 비밀번호가 일치하지 않습니다.");
        }

        String nextPassword = request.getNewPassword().trim();
        if (nextPassword.length() < 8) {
            throw new IllegalArgumentException("새 비밀번호는 8자 이상이어야 합니다.");
        }

        String encodedPassword = passwordEncoder.encode(nextPassword);
        memberMapper.updatePassword(user.getId(), encodedPassword);
    }
}
