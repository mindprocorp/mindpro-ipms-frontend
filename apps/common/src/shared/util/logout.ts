import { useAuthStore } from '@shared/providers/store/authStore'
import { useAlertStore } from '@shared/store/useAlertStore'

export const logoutWithConfirm = () => {
  useAlertStore.getState().openAlert({
    message: '정말 로그아웃 하시겠습니까?',
    confirmText: '로그아웃',
    onConfirm: () => {
      useAuthStore.getState().logout()
    },
  })
}
