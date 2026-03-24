package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class AdminUserDeleteResponse {
    private Long id;
    private String username;
    private LocalDateTime deletedAt;
}
