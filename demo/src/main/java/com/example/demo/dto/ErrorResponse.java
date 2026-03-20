package com.example.demo.dto;

import lombok.Data;

@Data
public class ErrorResponse {
    private String error;
    private String message;
    private int status;

    public ErrorResponse(String error, String message, int status){
        this.error = error;
        this.message = message;
        this.status = status;
    }
}
