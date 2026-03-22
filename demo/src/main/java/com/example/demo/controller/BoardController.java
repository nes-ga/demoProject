package com.example.demo.controller;

import com.example.demo.dto.BoardCreateRequest;
import com.example.demo.dto.BoardCreateResponse;
import com.example.demo.dto.BoardDetailResponse;
import com.example.demo.dto.BoardSearchRequest;
import com.example.demo.dto.BoardSummaryResponse;
import com.example.demo.dto.BoardUpdateRequest;
import com.example.demo.dto.CommentCreateRequest;
import com.example.demo.dto.CommentResponseDTO;
import com.example.demo.dto.CommentUpdateRequest;
import com.example.demo.dto.PageResponseDTO;
import com.example.demo.global.ApiResponse;
import com.example.demo.global.SessionAuthUtils;
import com.example.demo.service.BoardService;
import com.example.demo.service.CommentService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;
    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<BoardCreateResponse> create(@RequestBody @Valid BoardCreateRequest request,
                                                      HttpSession session) {
        String username = SessionAuthUtils.getRequiredUser(session).getUsername();
        BoardCreateResponse boardCreateResponse = boardService.create(request, username);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(boardCreateResponse);
    }

    @PostMapping("/{boardId}/comments")
    public ResponseEntity<Void> create(@PathVariable Long boardId,
                                       @RequestBody @Valid CommentCreateRequest request,
                                       HttpSession session) {
        String username = SessionAuthUtils.getRequiredUser(session).getUsername();
        commentService.createComment(boardId, request, username);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BoardDetailResponse>> findById(@PathVariable Long id) {
        BoardDetailResponse response = boardService.findById(id);
        return ResponseEntity.ok(new ApiResponse<>(response));
    }

    @PutMapping("/{boardId}/comments/{commentId}")
    public ResponseEntity<Void> updateComment(@PathVariable Long boardId,
                                              @PathVariable Long commentId,
                                              @RequestBody @Valid CommentUpdateRequest request,
                                              HttpSession session) {
        String username = SessionAuthUtils.getRequiredUser(session).getUsername();
        commentService.updateComment(commentId, request, username);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{boardId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long boardId,
                                              @PathVariable Long commentId,
                                              HttpSession session) {
        String username = SessionAuthUtils.getRequiredUser(session).getUsername();
        commentService.deleteComment(commentId, username);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody @Valid BoardUpdateRequest request) {
        boardService.update(id, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<PageResponseDTO<BoardSummaryResponse>> findAll(BoardSearchRequest request) {
        PageResponseDTO<BoardSummaryResponse> boards = boardService.findAll(request);
        return ResponseEntity.ok(boards);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boardService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/view")
    public ResponseEntity<Void> increaseView(@PathVariable Long id) {
        boardService.increaseView(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{boardId}/comments")
    public ResponseEntity<List<CommentResponseDTO>> findComment(@PathVariable Long boardId) {
        List<CommentResponseDTO> comments = commentService.findByBoardId(boardId);
        return ResponseEntity.ok(comments);
    }
}
