package com.example.demo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class BoardDetailResponse {

    private Long id;
    private String title;
    private String content;
    private Long viewCount;
    private String writer;
    private LocalDateTime createdAt;
    private List<CommentResponseDTO> comments;
}
