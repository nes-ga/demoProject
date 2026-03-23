package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class PasswordUpdateRequest {

    @NotBlank
    private String currentPassword;

    @NotBlank
    private String newPassword;
}
