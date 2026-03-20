package com.example.demo.repository;

import com.example.demo.domain.Member;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MemberMapper {
    Member findByUsername(@Param("username") String username);
}
