package com.example.demo.domain;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Member {
    private Long id;
    private String username;
    private String passwordHash;
    private String role;
    private LocalDateTime createdAt;
}
