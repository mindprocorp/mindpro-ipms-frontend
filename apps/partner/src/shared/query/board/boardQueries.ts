import { apiClient } from "../../api/client.ts";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import {
  boardApi,
  type BoardSaveRequest,
  type BoardListRequest,
  type CommentSaveRequest,
} from "@shared/api/board/boardApi.ts";

/**
 * @description 게시판 관련 React Query Mutation/Query 옵션들
 */
export const boardQueries = {
  /** 게시글 저장 (등록/수정) */
  saveBoard: () =>
    mutationOptions({
      mutationFn: ({ data, attachFiles }: { data: BoardSaveRequest; attachFiles?: File[] }) =>
        boardApi(apiClient).saveBoard(data, attachFiles),
    }),

  /** 게시글 상세 조회 */
  getBoardDetail: () =>
    mutationOptions({
      mutationFn: (boardSeq: string) =>
        boardApi(apiClient).getBoardDetail(boardSeq),
    }),

  /** 게시글 목록 검색 조회 (Query version) */
  getBoardListQuery: (payload: BoardListRequest) =>
    queryOptions({
      queryKey: ["board", "list", payload],
      queryFn: () => boardApi(apiClient).getBoardList(payload),
    }),

  /** 게시글 목록 검색 조회 (Mutation version - 유지) */
  getBoardList: () =>
    mutationOptions({
      mutationFn: (payload: BoardListRequest) =>
        boardApi(apiClient).getBoardList(payload),
    }),

  /** 게시글 상세 조회 (Query version) */
  getBoardDetailQuery: (boardSeq: string) =>
    queryOptions({
      queryKey: ["board", "detail", boardSeq],
      queryFn: () => boardApi(apiClient).getBoardDetail(boardSeq),
      staleTime: 0,
      refetchOnWindowFocus: true,
    }),

  /** 게시글 삭제 */
  deleteBoard: () =>
    mutationOptions({
      mutationFn: (boardSeq: string) =>
        boardApi(apiClient).deleteBoard(boardSeq),
    }),

  // ─── 댓글 ────────────────────────────────────────────────────────────────

  /** 댓글 목록 조회 */
  getCommentListQuery: (boardSeq: string) =>
    queryOptions({
      queryKey: ["board", "comment", boardSeq],
      queryFn: () => boardApi(apiClient).getCommentList(boardSeq),
      enabled: !!boardSeq,
    }),

  /** 댓글 등록 */
  saveComment: () =>
    mutationOptions({
      mutationFn: ({ boardSeq, data }: { boardSeq: string; data: CommentSaveRequest }) =>
        boardApi(apiClient).saveComment(boardSeq, data),
    }),

  /** 댓글 수정 */
  updateComment: () =>
    mutationOptions({
      mutationFn: ({ commentSeq, data }: { commentSeq: string; data: CommentSaveRequest }) =>
        boardApi(apiClient).updateComment(commentSeq, data),
    }),

  /** 댓글 삭제 */
  deleteComment: () =>
    mutationOptions({
      mutationFn: (commentSeq: string) =>
        boardApi(apiClient).deleteComment(commentSeq),
    }),
};
