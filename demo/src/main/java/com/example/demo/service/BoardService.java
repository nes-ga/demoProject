package com.example.demo.service;

import com.example.demo.domain.Board;
import com.example.demo.dto.*;
import com.example.demo.repository.BoardMapper;
import com.example.demo.repository.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardMapper boardMapper;
    private final CommentMapper commentMapper;

    @Transactional
    public BoardCreateResponse create(BoardCreateRequest request) {
        Board board = new Board();
        board.setTitle(request.getTitle());
        board.setContent(request.getContent());
        boardMapper.insert(board);

        return new BoardCreateResponse(board.getId(), board.getTitle(), board.getContent());
    }

    public List<Board> findAll() {
        return boardMapper.findAll();
    }

//    @Transactional
//    public BoardResponseDTO findById(Long id) {
//        boardMapper.increaseView(id);
//        Board board = boardMapper.findById(id);
//
//        if(board == null){
//            throw new IllegalArgumentException("게시글이 존재하지 않습니다.");
//        }else{
//            return new BoardResponseDTO(board.getId(),board.getTitle(),board.getContent());
//        }
//
////        return boardMapper.findById(id);
//    }

//    @Transactional(readOnly = true)
//    public List<BoardSummaryResponse> findAllPaged(BoardSearchRequest request) {
//
//        return boardMapper.search(
//                request.getoffset(),
//                request.getSize(),
//                request.getKeyword()
//        );
//    }

    public PageResponseDTO<BoardSummaryResponse> findAll(BoardSearchRequest request){

        String sortKey = "id";
        String sortOrder = "DESC";

        if(request.getSort() != null && !request.getSort().isBlank()){
            String[] split = request.getSort().split(",");
            sortKey = resolveSortKey(split[0]);
            sortOrder = split.length > 1 ? resolveSortOrder(split[1]): "DESC";

        }
        List<BoardSummaryResponse> boards = boardMapper.search(request.getoffset(), request.getSize(), sortKey, sortOrder,request.getKeyword());

        long total = boardMapper.count(request.getKeyword());

        return new PageResponseDTO<>(
                request.getPage(),
                request.getSize(),
                total,
                boards
        );
    }

    private String resolveSortKey(String sortKey){

        if(sortKey == null) return "id";

        return switch (sortKey){
            case "title" -> "title";
            case "createdAt" -> "created_at";
            case "viewCount" -> "view_count";
            case "id" -> "id";
            default -> "id";
        };
    }
    private String resolveSortOrder(String order){

        if(order == null) return "DESC";

        if(order.equalsIgnoreCase("asc")){
            return "ASC";
        }

        return "DESC";
    }

    public void update(Long id, BoardUpdateRequest request){

//        if(request.getTitle() != null || request.getTitle().isBlank())
//            throw new IllegalArgumentException("제목은 공백일 수 없습니다.");

        boardMapper.update(id, request.getTitle(), request.getContent());
    }

    @Transactional
    public void delete(Long id){

        int result = boardMapper.delete(id);

        if(result==0){
            throw new IllegalArgumentException("게시글이 존재하지 않습니다.");
        }
    }

    @Transactional
    public void increaseView(Long id){
        boardMapper.increaseView(id);
    }

    public BoardDetailResponse findById(Long id){

        //게시글 조회
        BoardDetailResponse board = boardMapper.findById(id);

        if (board == null ){
            throw new IllegalArgumentException("게시글이 존재하지 않습니다.");
        }

        // 댓글 조회
        List<CommentResponseDTO> comments = commentMapper.findByBoardId(id);

        // 댓글 트리 구성
        Map<Long, CommentResponseDTO> map = new HashMap<>();
        List<CommentResponseDTO> rootComments = new ArrayList<>();
        for (CommentResponseDTO c : comments) {
            map.put(c.getId(), c);
        }

        for (CommentResponseDTO c : comments) {

            if (c.getParentId() == null) {
                rootComments.add(c);
            } else {
                CommentResponseDTO parent = map.get(c.getParentId());
                if (parent != null) {
                    parent.getChildren().add(c);
                }
            }
        }
        board.setComments(rootComments);

                // 4. 최종 응답 생성
        return board;
    }
}
