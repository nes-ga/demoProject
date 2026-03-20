package com.example.demo.controller;

import com.example.demo.domain.Board;
import com.example.demo.dto.*;
import com.example.demo.global.ApiResponse;
import com.example.demo.service.BoardService;
import com.example.demo.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;
    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<BoardCreateResponse> create(@RequestBody @Valid BoardCreateRequest request) {
        BoardCreateResponse boardCreateResponse = boardService.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(boardCreateResponse);
    }

    @PostMapping("/{boardId}/comments")
    public ResponseEntity<Void> create(@PathVariable Long boardId, @RequestBody @Valid CommentCreateRequest request){
        log.debug("댓글 생성~");
        commentService.createComment(boardId, request);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

//    @GetMapping
//    public List<Board> findAll() {
//        return boardService.findAll();
//    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BoardDetailResponse>> findById(@PathVariable Long id) {
//        BoardResponseDTO boardCreateResponse = boardService.findById(id);
        BoardDetailResponse response = boardService.findById(id);

//        return ResponseEntity.ok(new ApiResponse<>(boardCreateResponse));
        return ResponseEntity.ok(new ApiResponse<>(response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody @Valid BoardUpdateRequest request){
        boardService.update(id, request);

        return ResponseEntity.ok().build();
    }

//    @GetMapping
//    public ResponseEntity<List<BoardSummaryResponse>> findAllPaged(BoardSearchRequest request) {
//
//        List<BoardSummaryResponse> boards = boardService.findAllPaged(request);
//
//        return ResponseEntity.ok(boards);
//    }

    @GetMapping
    public ResponseEntity<PageResponseDTO<BoardSummaryResponse>> findAll(BoardSearchRequest request){

        PageResponseDTO<BoardSummaryResponse> boards = boardService.findAll(request);

        return ResponseEntity.ok(boards);
    }

    @DeleteMapping
    public ResponseEntity<Void> delete(@PathVariable Long id){
        boardService.delete(id);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/view")
    public ResponseEntity<Void> increaseView(@PathVariable Long id){

        boardService.increaseView(id);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/{boardId}/comments")
    public ResponseEntity<List<CommentResponseDTO>> findComment(@PathVariable Long boardId){

        List<CommentResponseDTO> comments = commentService.findByBoardId(boardId);

        return ResponseEntity.ok(comments);
    }
}
