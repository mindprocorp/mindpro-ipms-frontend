import { create } from "zustand";

type ErrorInfo = {
  status?: number;
  code?: string;
  message?: string;
};

type ConnectionStore = {
  isDown: boolean;
  lastError: ErrorInfo | null;
  setDown: (error?: ErrorInfo) => void;
  setUp: () => void;
};

/**
 * 백엔드 연결 상태 전역 추적.
 * - axios interceptor 가 network error (status:0) 감지 시 setDown
 * - 응답 성공 시 setUp
 * - App.tsx 에서 isDown 일 때 NotFound 화면 렌더
 */
export const useConnectionStore = create<ConnectionStore>((set) => ({
  isDown: false,
  lastError: null,
  setDown: (error) => set({ isDown: true, lastError: error ?? null }),
  setUp: () => set({ isDown: false, lastError: null }),
}));
