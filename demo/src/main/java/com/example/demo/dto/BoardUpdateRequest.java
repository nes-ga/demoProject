package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class BoardUpdateRequest {

    @NotBlank(message = "제목을 입력해주세요")
    private String title;
    private String content;
}
