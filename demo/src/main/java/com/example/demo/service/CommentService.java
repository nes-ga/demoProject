package com.example.demo.service;

import com.example.demo.dto.CommentCreateRequest;
import com.example.demo.dto.CommentResponseDTO;
import com.example.demo.dto.CommentUpdateRequest;
import com.example.demo.dto.SessionUser;
import com.example.demo.global.ForbiddenException;
import com.example.demo.global.SessionAuthUtils;
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
    public void updateComment(Long id, CommentUpdateRequest request, SessionUser user) {
        CommentResponseDTO comment = getRequiredComment(id);
        validateCommentAuthority(comment, user);

        int updated = commentMapper.updateComment(id, request.getContent());
        if (updated == 0) {
            throw new IllegalArgumentException("Comment not found.");
        }
    }

    @Transactional
    public void deleteComment(Long id, SessionUser user) {
        CommentResponseDTO comment = getRequiredComment(id);
        validateCommentAuthority(comment, user);

        if (commentMapper.countActiveChildren(id) > 0) {
            throw new IllegalStateException("Comments with replies cannot be deleted.");
        }

        int deleted = commentMapper.deleteComment(id);
        if (deleted == 0) {
            throw new IllegalArgumentException("Comment not found.");
        }
    }

    private CommentResponseDTO getRequiredComment(Long id) {
        CommentResponseDTO comment = commentMapper.findById(id);
        if (comment == null) {
            throw new IllegalArgumentException("Comment not found.");
        }

        return comment;
    }

    private void validateCommentAuthority(CommentResponseDTO comment, SessionUser user) {
        if (SessionAuthUtils.isAdmin(user)) {
            return;
        }

        if (!comment.getWriter().equals(user.getUsername())) {
            throw new ForbiddenException("Only the author or an admin can modify this comment.");
        }
    }
}
