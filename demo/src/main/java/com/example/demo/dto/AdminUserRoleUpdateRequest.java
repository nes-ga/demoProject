package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminUserRoleUpdateRequest {

    @NotBlank(message = "Role is required.")
    private String role;
}
