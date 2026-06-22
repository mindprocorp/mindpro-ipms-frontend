/**
 * 공통 API 응답 타입
 */
export interface ApiResponse<T> {
  status: number; // status
  message: string; // 응답 메시지
  data: T; // 실제 payload
  timestamp: string; // datetime
}
