package com.example.demo.global;

import com.example.demo.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(Exception e) {

        ErrorResponse error = new ErrorResponse(
                "NOT_FOUND",
                e.getMessage(),
                HttpStatus.NOT_FOUND.value()
        );

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAll(Exception e) {

        ErrorResponse error = new ErrorResponse(
                "INTERNAL_SERVER_ERROR",
                "서버 오류가 발생했습니다.",
                HttpStatus.INTERNAL_SERVER_ERROR.value()
        );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(MethodArgumentNotValidException e){

        String message = e.getBindingResult()
                .getFieldError()
                .getDefaultMessage();

        Map<String, String> response = new HashMap<>();
        response.put("error", "BAD_REQUEST");
        response.put("message", message);

        return ResponseEntity.badRequest().body(response);
    }
}
