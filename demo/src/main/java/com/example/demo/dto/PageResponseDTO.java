package com.example.demo.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class PageResponseDTO<T> {

    int page;
    int size;
    long totalElements;
    int totalPages;

    private List<T> content;

    public PageResponseDTO(int page, int size, long totalElements, List<T> content){
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = (int) Math.ceil((double) totalElements / size);
        this.content = content;
    }
}
