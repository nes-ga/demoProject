package com.example.demo.repository;

import com.example.demo.domain.Board;
import com.example.demo.dto.BoardDetailResponse;
import com.example.demo.dto.BoardSummaryResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BoardMapper {

    void insert(Board board);

    List<Board> findAll();

    BoardDetailResponse findById(Long id);

    List<BoardSummaryResponse> findAllPaged(
            @Param("offset") int offset,
            @Param("size") int size
    );

    List<BoardSummaryResponse> search(
            @Param("offset") int offset,
            @Param("size") int size,
            @Param("sortKey") String sortKey,
            @Param("sortOrder") String sortOrder,
            @Param("keyword") String keyword
    );

    long count(@Param("keyword") String keyword);

    void update(
            @Param("id") Long id,
            @Param("title") String title,
            @Param("content") String content
    );

    int delete(@Param("id") Long id);

    void increaseView(@Param("id") Long id);
}
