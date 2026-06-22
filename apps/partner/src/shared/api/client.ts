import { createApiClient, type ApiClient } from "@repo/api";
import { tokenProvider } from "@shared/providers/tokenProvider";
import { useAlertStore } from "@shared/store/useAlertStore";
import { useConnectionStore } from "@shared/store/useConnectionStore";

const onError = (err: any) => {
  // 401 에러는 onUnauthorized에서 처리하므로 중복 알럿 방지
  if (err.status === 401) return;

  // 네트워크 에러(status 0) — 전역 NotFound 화면이 처리
  if (err.status === 0) {
    useConnectionStore.getState().setDown({
      status: err.status,
      code: err.code,
      message: err.message,
    });
    return;
  }

  useAlertStore.getState().openAlert({
    title: "ERROR",
    message: err.message || "요청 처리 중 오류가 발생했습니다.",
  });
};

// 응답 성공 → 연결 정상 마킹 (백엔드 복구 후 자동 해제)
const trackConnection = (client: ApiClient) => {
  client.axios.interceptors.response.use((res) => {
    useConnectionStore.getState().setUp();
    return res;
  });
};

// 토큰 인증이 필요한 API용 클라이언트
export const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_APP_API_URL,
  tokenProvider,
  onError,
});

// 공개 API용 클라이언트 (로그인, 회원가입 등)
export const publicApiClient = createApiClient({
  baseURL: import.meta.env.VITE_APP_API_URL,
  onError,
});

trackConnection(apiClient);
trackConnection(publicApiClient);