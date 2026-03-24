package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BoardCreateRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    public BoardCreateRequest() {
    }
}
