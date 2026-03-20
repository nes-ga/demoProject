package com.example.demo.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BoardResponseDTO {
    private Long id;
    private String title;
    private String content;
    private int viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public BoardResponseDTO(long id, String title, String content){
        this.id = id;
        this.title = title;
        this.content = content;
    }
}
