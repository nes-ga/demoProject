package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

//dto란 데이터를 옮기기 위한 객체 (DATA Transfer Object)
@Data
public class BoardCreateResponse {

    private Long id;
    private String title;
    private String content;

    public BoardCreateResponse(Long id, String title, String content){
        this.id = id;
        this.title = title;
        this.content = content;
    }
}
