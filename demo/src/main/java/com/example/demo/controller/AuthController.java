package com.example.demo.controller;

import com.example.demo.dto.AuthUserResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.PasswordUpdateRequest;
import com.example.demo.dto.SessionUser;
import com.example.demo.dto.SignupRequest;
import com.example.demo.global.ApiResponse;
import com.example.demo.global.SessionAuthUtils;
import com.example.demo.service.AuthService;
import com.example.demo.service.MemberService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final MemberService memberService;

    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@RequestBody @Valid SignupRequest request) {
        memberService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthUserResponse>> login(@RequestBody @Valid LoginRequest request,
                                                               HttpSession session) {
        AuthUserResponse user = authService.login(request, session);
        return ResponseEntity.ok(new ApiResponse<>(user));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        authService.logout(session);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthUserResponse>> me(HttpSession session) {
        AuthUserResponse user = authService.getCurrentUser(session);
        return ResponseEntity.ok(new ApiResponse<>(user));
    }

    @PatchMapping("/password")
    public ResponseEntity<Void> updatePassword(@RequestBody @Valid PasswordUpdateRequest request,
                                               HttpSession session) {
        SessionUser user = SessionAuthUtils.getRequiredUser(session);
        authService.updatePassword(user, request);
        return ResponseEntity.ok().build();
    }
}
