package com.example.demo.controller;

import com.example.demo.dto.AdminUserDeleteResponse;
import com.example.demo.dto.AdminUserResponse;
import com.example.demo.dto.AdminUserRoleUpdateRequest;
import com.example.demo.dto.BoardDetailResponse;
import com.example.demo.dto.BoardSearchRequest;
import com.example.demo.dto.BoardSummaryResponse;
import com.example.demo.dto.PageResponseDTO;
import com.example.demo.dto.SessionUser;
import com.example.demo.global.ApiResponse;
import com.example.demo.global.SessionAuthUtils;
import com.example.demo.service.BoardService;
import com.example.demo.service.CommentService;
import com.example.demo.service.MemberService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final BoardService boardService;
    private final CommentService commentService;
    private final MemberService memberService;

    @GetMapping("/boards")
    public ResponseEntity<PageResponseDTO<BoardSummaryResponse>> getBoards(BoardSearchRequest request,
                                                                           HttpSession session) {
        SessionAuthUtils.getRequiredAdmin(session);
        return ResponseEntity.ok(boardService.findAll(request));
    }

    @GetMapping("/boards/{id}")
    public ResponseEntity<ApiResponse<BoardDetailResponse>> getBoardDetail(@PathVariable Long id,
                                                                           HttpSession session) {
        SessionAuthUtils.getRequiredAdmin(session);
        return ResponseEntity.ok(new ApiResponse<>(boardService.findById(id)));
    }

    @DeleteMapping("/boards/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable Long id, HttpSession session) {
        SessionUser admin = SessionAuthUtils.getRequiredAdmin(session);
        boardService.delete(id, admin);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id, HttpSession session) {
        SessionUser admin = SessionAuthUtils.getRequiredAdmin(session);
        commentService.deleteComment(id, admin);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users")
    public ResponseEntity<PageResponseDTO<AdminUserResponse>> getUsers(HttpSession session,
                                                                       Integer page,
                                                                       Integer size,
                                                                       String keyword) {
        SessionAuthUtils.getRequiredAdmin(session);
        int resolvedPage = page == null ? 0 : Math.max(page, 0);
        int resolvedSize = size == null ? 10 : Math.max(size, 1);
        return ResponseEntity.ok(memberService.findUsers(resolvedPage, resolvedSize, keyword));
    }

    @GetMapping("/users/admins")
    public ResponseEntity<ApiResponse<java.util.List<AdminUserResponse>>> getAdminUsers(HttpSession session) {
        SessionAuthUtils.getRequiredAdmin(session);
        return ResponseEntity.ok(new ApiResponse<>(memberService.findAdminUsers()));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<Void> updateUserRole(@PathVariable Long id,
                                               @RequestBody @Valid AdminUserRoleUpdateRequest request,
                                               HttpSession session) {
        SessionUser admin = SessionAuthUtils.getRequiredAdmin(session);
        memberService.updateRole(id, request.getRole(), admin);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<AdminUserDeleteResponse>> deleteUser(@PathVariable Long id, HttpSession session) {
        SessionUser admin = SessionAuthUtils.getRequiredAdmin(session);
        AdminUserDeleteResponse response = memberService.deleteUser(id, admin);
        return ResponseEntity.ok(new ApiResponse<>(response));
    }
}
