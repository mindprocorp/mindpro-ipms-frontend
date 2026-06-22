import { useAuthStore } from '@shared/store/useUserInfoStore'
import { useAlertStore } from '@shared/store/useAlertStore'
import type { QueryClient } from '@tanstack/react-query'

/**
 * 로그아웃 confirm 후 실행.
 * - 토큰/유저 클리어
 * - react-query 캐시 전역 클리어 (이전 유저 데이터가 다음 로그인에 노출되는 사고 방지)
 */
export const logoutWithConfirm = (queryClient?: QueryClient) => {
  useAlertStore.getState().openAlert({
    message: '정말 로그아웃 하시겠습니까?',
    confirmText: '로그아웃',
    onConfirm: () => {
      useAuthStore.getState().clearUser();
      queryClient?.clear();
    },
  })
}
