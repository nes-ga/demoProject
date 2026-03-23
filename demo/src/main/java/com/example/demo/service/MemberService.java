package com.example.demo.service;

import com.example.demo.domain.Member;
import com.example.demo.dto.AdminUserResponse;
import com.example.demo.dto.PageResponseDTO;
import com.example.demo.dto.SessionUser;
import com.example.demo.dto.SignupRequest;
import com.example.demo.global.ForbiddenException;
import com.example.demo.repository.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MemberService {

    private static final Set<String> ALLOWED_ROLES = Set.of("USER", "ADMIN");

    private final MemberMapper memberMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void register(SignupRequest request) {
        String username = request.getUsername() == null ? "" : request.getUsername().trim();
        String password = request.getPassword() == null ? "" : request.getPassword().trim();

        if (username.length() < 3) {
            throw new IllegalArgumentException("Username must be at least 3 characters.");
        }

        if (password.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters.");
        }

        if (memberMapper.findByUsername(username) != null) {
            throw new IllegalArgumentException("Username is already in use.");
        }

        Member member = new Member();
        member.setUsername(username);
        member.setPasswordHash(passwordEncoder.encode(password));
        member.setRole("USER");
        memberMapper.insert(member);
    }

    public PageResponseDTO<AdminUserResponse> findUsers(int page, int size, String keyword) {
        List<AdminUserResponse> users = memberMapper.searchUsers(page * size, size, keyword);
        long total = memberMapper.countUsers(keyword);
        return new PageResponseDTO<>(page, size, total, users);
    }

    @Transactional
    public void updateRole(Long id, String role, SessionUser admin) {
        String normalizedRole = role == null ? "" : role.trim().toUpperCase();

        if (!ALLOWED_ROLES.contains(normalizedRole)) {
            throw new IllegalArgumentException("Role must be USER or ADMIN.");
        }

        if (admin.getId().equals(id)) {
            throw new ForbiddenException("You cannot change your own role.");
        }

        int updated = memberMapper.updateRole(id, normalizedRole);
        if (updated == 0) {
            throw new IllegalArgumentException("User not found.");
        }
    }
}
