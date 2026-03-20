package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

//dto란 데이터를 옮기기 위한 객체 (DATA Transfer Object)
@Data
public class BoardCreateRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    public BoardCreateRequest(){
    }
}
