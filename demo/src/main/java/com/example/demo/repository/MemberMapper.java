package com.example.demo.repository;

import com.example.demo.domain.Member;
import com.example.demo.dto.AdminUserResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MemberMapper {
    Member findByUsername(@Param("username") String username);
    Member findById(@Param("id") Long id);
    void insert(Member member);

    List<AdminUserResponse> searchUsers(@Param("offset") int offset,
                                        @Param("size") int size,
                                        @Param("keyword") String keyword);

    long countUsers(@Param("keyword") String keyword);

    int updateRole(@Param("id") Long id, @Param("role") String role);
    int updatePassword(@Param("id") Long id, @Param("passwordHash") String passwordHash);
}
