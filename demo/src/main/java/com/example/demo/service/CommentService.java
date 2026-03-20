package com.example.demo.service;

import com.example.demo.dto.CommentCreateRequest;
import com.example.demo.dto.CommentResponseDTO;
import com.example.demo.repository.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
}
