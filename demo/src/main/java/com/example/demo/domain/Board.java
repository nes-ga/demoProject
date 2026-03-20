package com.example.demo.domain;

import lombok.Data;

import java.time.LocalDateTime;

//Domain의 경우는 로직이 들어갈 수 있다.
@Data
public class Board {
    private Long id;
    private String title;
    private String content;
    private String writer;
    private LocalDateTime createdAt;
}
