package com.example.demo.dto;

import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class BoardDetailResponse {

    private Long id;
    private String title;
    private String content;
    private Long viewCount;
    private String writer;
    private LocalDateTime createdAt;
//    private LocalDateTime updatedAt;

    private List<CommentResponseDTO> comments;

    public BoardDetailResponse(Long id, String title, String content, Long viewCount,
                               String writer, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.viewCount = viewCount;
        this.writer = writer;
        this.createdAt = createdAt;
//        this.updatedAt = updatedAt;
//        this.comments = comments;
    }

    public void setComments(List<CommentResponseDTO> comments){
        this.comments = comments;
    }
}

/*
*
* SELECT id, title, content, view_count, created_at AS createdAt ,updated_at
        FROM board
        WHERE id = #{id}
        AND deleted_at IS NULL
*
* */
