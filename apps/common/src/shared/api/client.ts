import { createApiClient } from "@repo/api";
import { tokenProvider } from "@shared/providers/tokenProvider";
import { useAlertStore } from "@shared/store/useAlertStore";

const onError = (err: { message: string }) => {
  useAlertStore.getState().openAlert({
    title: "ERROR",
    message: err.message,
  });
};

// public api 구분한 이유 : 브라우저에 만료된 토큰이 남아 있을경우 로그인 등 헤더 값 필요없는 api에서 만료된 헤더 토큰 값으로 에러 발생

// 토큰 인증이 필요한 API용 클라이언트
export const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  tokenProvider,
  onError,
});

// 공개 API용 클라이언트 (로그인, 회원가입 등)
export const publicApiClient = createApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  onError,
});
