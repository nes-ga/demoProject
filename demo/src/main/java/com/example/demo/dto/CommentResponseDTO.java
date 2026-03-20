package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
//@AllArgsConstructor
public class CommentResponseDTO {

    private Long id;
    private Long boardId;
    private Long parentId;
    private String content;
    private String writer;
    private LocalDateTime createdAt;

    private List<CommentResponseDTO> children = new ArrayList<>();

    public CommentResponseDTO(Long id, Long boardId, Long parentId, String content, String writer, LocalDateTime createdAt){
        this.id = id;
        this.boardId = boardId;
        this.parentId = parentId;
        this.content = content;
        this.writer = writer;
        this.createdAt = createdAt;
    }

}
