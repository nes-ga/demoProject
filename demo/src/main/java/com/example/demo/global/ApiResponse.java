package com.example.demo.global;

import lombok.Getter;

@Getter
public class ApiResponse<T> {

    private boolean success;
    private T data;
    private String message;

    public ApiResponse(T data){
        this.success = true;
        this.data = data;
    }

    public ApiResponse(String message){
        this.success = false;
        this.message = message;
    }
}
