package com.example.demo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class BoardSummaryResponse {

    private Long id;
    private String title;
    private Long viewCount;
    private LocalDateTime createdAt;
}
