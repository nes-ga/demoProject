package com.example.demo.service;

import com.example.demo.dto.CommentCreateRequest;
import com.example.demo.dto.CommentResponseDTO;
import com.example.demo.dto.CommentUpdateRequest;
import com.example.demo.global.ForbiddenException;
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
public class CommentService {

    private final CommentMapper commentMapper;

    public List<CommentResponseDTO> findByBoardId(Long boardId) {
        List<CommentResponseDTO> comments = commentMapper.findByBoardId(boardId);
        Map<Long, CommentResponseDTO> map = new HashMap<>();
        List<CommentResponseDTO> result = new ArrayList<>();

        for (CommentResponseDTO comment : comments) {
            map.put(comment.getId(), comment);
        }

        for (CommentResponseDTO comment : comments) {
            if (comment.getParentId() == null) {
                result.add(comment);
            } else {
                CommentResponseDTO parent = map.get(comment.getParentId());
                if (parent != null) {
                    parent.getChildren().add(comment);
                }
            }
        }

        return result;
    }

    public void createComment(Long boardId, CommentCreateRequest request, String writer) {
        commentMapper.createComment(
                boardId,
                request.getParentId(),
                request.getContent(),
                writer
        );
    }

    @Transactional
    public void updateComment(Long id, CommentUpdateRequest request, String writer) {
        CommentResponseDTO comment = getRequiredComment(id);
        validateWriter(comment, writer);

        int updated = commentMapper.updateComment(id, request.getContent());
        if (updated == 0) {
            throw new IllegalArgumentException("댓글이 존재하지 않습니다.");
        }
    }

    @Transactional
    public void deleteComment(Long id, String writer) {
        CommentResponseDTO comment = getRequiredComment(id);
        validateWriter(comment, writer);

        if (commentMapper.countActiveChildren(id) > 0) {
            throw new IllegalStateException("답글이 있는 댓글은 삭제할 수 없습니다.");
        }

        int deleted = commentMapper.deleteComment(id);
        if (deleted == 0) {
            throw new IllegalArgumentException("댓글이 존재하지 않습니다.");
        }
    }

    private CommentResponseDTO getRequiredComment(Long id) {
        CommentResponseDTO comment = commentMapper.findById(id);
        if (comment == null) {
            throw new IllegalArgumentException("댓글이 존재하지 않습니다.");
        }

        return comment;
    }

    private void validateWriter(CommentResponseDTO comment, String writer) {
        if (!comment.getWriter().equals(writer)) {
            throw new ForbiddenException("본인이 작성한 댓글만 수정하거나 삭제할 수 있습니다.");
        }
    }
}
