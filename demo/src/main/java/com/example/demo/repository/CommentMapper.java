package com.example.demo.repository;

import com.example.demo.dto.CommentResponseDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommentMapper {

    List<CommentResponseDTO> CommentResponseDTO(@Param("boardId") Long boardId);

    List<CommentResponseDTO> findByBoardId(@Param("boardId") Long boardId);

    void createComment(@Param("boardId") Long boardId,
                       @Param("parentId") Long parentId,
                       @Param("content") String content,
                       @Param("writer") String writer);
}
