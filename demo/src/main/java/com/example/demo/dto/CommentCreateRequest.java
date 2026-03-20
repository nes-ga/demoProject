package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class CommentCreateRequest {

    @NotBlank
    private String content;

    @NotBlank
    private String writer;

    private Long parentId;

}
