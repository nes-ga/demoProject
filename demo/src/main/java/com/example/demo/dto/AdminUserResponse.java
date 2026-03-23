package com.example.demo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class AdminUserResponse {
    private Long id;
    private String username;
    private String role;
    private LocalDateTime createdAt;
}
