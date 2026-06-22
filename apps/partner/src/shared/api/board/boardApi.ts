import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";

// ─── 요청 타입 ──────────────────────────────────────────────────────────────

export type CommentSaveRequest = {
  parentCommentSeq?: string;
  commentType?: string;
  commentContent: string;
  commentCode?: string;
};

export type BoardSaveRequest = {
  boardSeq?: string;
  categoryCode: string;
  title: string;
  content?: string;
  isPinned?: string;
  pinnedStartAt?: string;
  pinnedEndAt?: string;
  tags?: string;
  postStatus?: string;
  deleteFileSeqList?: string[];
};

export type BoardListRequest = {
  page: number;
  pageSize: number;
  userInfoSeq?: string;
  searchCondition?: Array<Record<string, string>>;
  textFilters?: Array<Record<string, string>>;
  dateFilters?: Array<Record<string, string>>;
};

// ─── 응답 타입 ──────────────────────────────────────────────────────────────

export type BoardCategory = {
  code: string;
  codeName: string;
};

export type BoardAuthor = {
  userSeq: string;
  userName: string;
  deptName?: string;
  profileImageUrl?: string;
};

export type BoardFileInfo = {
  fileSeq: string;
  fileName: string;
  fileSize: string;
  fileUrl: string;
  docSeq: string;
  docNm: string;
};

export type BoardListItem = {
  boardSeq: string;
  category: BoardCategory;
  tags: string[];
  title: string;
  viewCount: number;
  commentCount?: number;
  isPinned: string;
  pinnedStartAt: string;
  pinnedEndAt: string;
  hasFile: string;
  postStatus: string;
  createUser: BoardAuthor;
  createAt: string;
};

export type BoardDetail = {
  boardSeq: string;
  category: BoardCategory;
  tags: string[];
  title: string;
  content: string;
  viewCount: number;
  isPinned: string;
  pinnedStartAt: string;
  pinnedEndAt: string;
  fileList: BoardFileInfo[];
  postStatus: string;
  createUser: BoardAuthor;
  createAt: string;
  updateAt: string;
};

export type BoardListResponse = {
  list: BoardListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
};

export type BoardMainItem = {
  configSeq: string;
  boardType: "BOARD" | "CATEGORY";
  boardName: string;
  recentPosts: BoardListItem[];
  children: BoardMainItem[];
  canRead?: boolean;
  canWrite?: boolean;
};

export type CommentItem = {
  commentSeq: string;
  parentCommentSeq?: string;
  commentType?: string;
  commentContent: string;
  commentCode?: string;
  delYn?: string;
  createUser: BoardAuthor;
  createAt: string;
  updateAt: string;
  replies: CommentItem[];
};

// ─── API 서비스 ─────────────────────────────────────────────────────────────

export function boardApi(client: ApiClient) {
  return {
    /** 게시글 저장 (등록/수정) */
    saveBoard: async (
      data: BoardSaveRequest,
      attachFiles?: File[]
    ): Promise<ApiResponse<BoardDetail>> => {
      const formData = new FormData();
      formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
      if (attachFiles?.length) {
        for (const file of attachFiles) {
          formData.append("files", file);
        }
      }
      const { data: res } = await client.axios.post<ApiResponse<BoardDetail>>(
        "/api/board",
        formData
      );
      return res;
    },

    /** 게시글 상세 조회 */
    getBoardDetail: async (boardSeq: string): Promise<ApiResponse<BoardDetail>> => {
      const { data } = await client.axios.get<ApiResponse<BoardDetail>>(
        `/api/board/${boardSeq}`
      );
      return data;
    },

    /** 게시글 목록 검색 조회 */
    getBoardList: async (
      payload: BoardListRequest
    ): Promise<ApiResponse<BoardListResponse>> => {
      const { data } = await client.axios.post<ApiResponse<BoardListResponse>>(
        "/api/board/list",
        payload
      );
      return data;
    },

    /** 메인 페이지 통합 조회 */
    getBoardMain: async (): Promise<ApiResponse<BoardMainItem[]>> => {
      const { data } = await client.axios.get<ApiResponse<BoardMainItem[]>>(
        "/api/board/main"
      );
      return data;
    },

    /** 게시글 삭제 */
    deleteBoard: async (boardSeq: string): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.delete<ApiResponse<void>>(
        `/api/board/${boardSeq}`
      );
      return data;
    },

    // ─── 댓글 ────────────────────────────────────────────────────────────────

    /** 댓글 목록 조회 */
    getCommentList: async (boardSeq: string): Promise<ApiResponse<CommentItem[]>> => {
      const { data } = await client.axios.get<ApiResponse<CommentItem[]>>(
        `/api/board/${boardSeq}/comment`
      );
      return data;
    },

    /** 댓글 등록 */
    saveComment: async (
      boardSeq: string,
      body: CommentSaveRequest
    ): Promise<ApiResponse<CommentItem>> => {
      const { data } = await client.axios.post<ApiResponse<CommentItem>>(
        `/api/board/${boardSeq}/comment`,
        body
      );
      return data;
    },

    /** 댓글 수정 */
    updateComment: async (
      commentSeq: string,
      body: CommentSaveRequest
    ): Promise<ApiResponse<CommentItem>> => {
      const { data } = await client.axios.put<ApiResponse<CommentItem>>(
        `/api/board/comment/${commentSeq}`,
        body
      );
      return data;
    },

    /** 댓글 삭제 */
    deleteComment: async (commentSeq: string): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.delete<ApiResponse<void>>(
        `/api/board/comment/${commentSeq}`
      );
      return data;
    },
  };
}
