package com.example.demo.service;

import com.example.demo.dto.BoardCreateRequest;
import com.example.demo.dto.BoardCreateResponse;
import com.example.demo.dto.BoardDetailResponse;
import com.example.demo.dto.BoardSearchRequest;
import com.example.demo.dto.BoardSummaryResponse;
import com.example.demo.dto.BoardUpdateRequest;
import com.example.demo.dto.CommentResponseDTO;
import com.example.demo.dto.PageResponseDTO;
import com.example.demo.dto.SessionUser;
import com.example.demo.global.ForbiddenException;
import com.example.demo.global.SessionAuthUtils;
import com.example.demo.repository.BoardMapper;
import com.example.demo.repository.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardMapper boardMapper;
    private final CommentMapper commentMapper;

    @Transactional
    public BoardCreateResponse create(BoardCreateRequest request, String writer) {
        com.example.demo.domain.Board board = new com.example.demo.domain.Board();
        board.setTitle(request.getTitle());
        board.setContent(request.getContent());
        board.setWriter(writer);
        boardMapper.insert(board);

        return new BoardCreateResponse(board.getId(), board.getTitle(), board.getContent());
    }

    public List<com.example.demo.domain.Board> findAll() {
        return boardMapper.findAll();
    }

    public PageResponseDTO<BoardSummaryResponse> findAll(BoardSearchRequest request) {
        String sortKey = "id";
        String sortOrder = "DESC";

        if (request.getSort() != null && !request.getSort().isBlank()) {
            String[] split = request.getSort().split(",");
            sortKey = resolveSortKey(split[0]);
            sortOrder = split.length > 1 ? resolveSortOrder(split[1]) : "DESC";
        }

        List<BoardSummaryResponse> boards = boardMapper.search(
                request.getoffset(),
                request.getSize(),
                sortKey,
                sortOrder,
                request.getKeyword()
        );

        long total = boardMapper.count(request.getKeyword());

        return new PageResponseDTO<>(
                request.getPage(),
                request.getSize(),
                total,
                boards
        );
    }

    private String resolveSortKey(String sortKey) {
        if (sortKey == null) {
            return "id";
        }

        return switch (sortKey) {
            case "title" -> "title";
            case "createdAt" -> "created_at";
            case "viewCount" -> "view_count";
            case "id" -> "id";
            default -> "id";
        };
    }

    private String resolveSortOrder(String order) {
        if (order == null) {
            return "DESC";
        }

        if (order.equalsIgnoreCase("asc")) {
            return "ASC";
        }

        return "DESC";
    }

    @Transactional
    public void update(Long id, BoardUpdateRequest request, SessionUser user) {
        BoardDetailResponse board = getRequiredBoard(id);
        validateBoardAuthority(board, user);
        boardMapper.update(id, request.getTitle(), request.getContent());
    }

    @Transactional
    public void delete(Long id, SessionUser user) {
        BoardDetailResponse board = getRequiredBoard(id);
        validateBoardAuthority(board, user);

        int result = boardMapper.delete(id);
        if (result == 0) {
            throw new IllegalArgumentException("Board not found.");
        }
    }

    @Transactional
    public void increaseView(Long id) {
        boardMapper.increaseView(id);
    }

    public BoardDetailResponse findById(Long id) {
        BoardDetailResponse board = getRequiredBoard(id);

        List<CommentResponseDTO> comments = commentMapper.findByBoardId(id);

        Map<Long, CommentResponseDTO> map = new HashMap<>();
        List<CommentResponseDTO> rootComments = new ArrayList<>();
        for (CommentResponseDTO comment : comments) {
            map.put(comment.getId(), comment);
        }

        for (CommentResponseDTO comment : comments) {
            if (comment.getParentId() == null) {
                rootComments.add(comment);
            } else {
                CommentResponseDTO parent = map.get(comment.getParentId());
                if (parent != null) {
                    parent.getChildren().add(comment);
                }
            }
        }

        board.setComments(rootComments);
        return board;
    }

    private BoardDetailResponse getRequiredBoard(Long id) {
        BoardDetailResponse board = boardMapper.findById(id);
        if (board == null) {
            throw new IllegalArgumentException("Board not found.");
        }

        return board;
    }

    private void validateBoardAuthority(BoardDetailResponse board, SessionUser user) {
        if (SessionAuthUtils.isAdmin(user)) {
            return;
        }

        if (!board.getWriter().equals(user.getUsername())) {
            throw new ForbiddenException("Only the author or an admin can modify this board.");
        }
    }
}
