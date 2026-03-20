package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoardSearchRequest {

    private int page = 0;
    private int size = 10;
    private String keyword;
    private String sort;
    private String searchType;

    public int getoffset(){
        return page * size;
    }
}
