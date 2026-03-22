package com.example.demo.repository;

import com.example.demo.dto.CommentResponseDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommentMapper {

    List<CommentResponseDTO> CommentResponseDTO(@Param("boardId") Long boardId);

    List<CommentResponseDTO> findByBoardId(@Param("boardId") Long boardId);

    CommentResponseDTO findById(@Param("id") Long id);

    void createComment(@Param("boardId") Long boardId,
                       @Param("parentId") Long parentId,
                       @Param("content") String content,
                       @Param("writer") String writer);

    int updateComment(@Param("id") Long id,
                      @Param("content") String content);

    int deleteComment(@Param("id") Long id);

    int countActiveChildren(@Param("id") Long id);
}
