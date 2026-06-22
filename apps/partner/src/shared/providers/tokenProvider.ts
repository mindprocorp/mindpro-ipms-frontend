import type { TokenProvider } from "@repo/api";
import { useAuthStore } from "@shared/store/useUserInfoStore";
import { useAlertStore } from "@shared/store/useAlertStore";

export const tokenProvider: TokenProvider = {
  getAccessToken: () => useAuthStore.getState().accessToken,
  setAccessToken: (token) => {
    useAuthStore.getState().setToken(token);
  },
  getRefreshToken: () => useAuthStore.getState().refreshToken,
  setRefreshToken: (token) => {
    useAuthStore.getState().setRefreshToken(token);
  },
  onUnauthorized: () => {
    useAuthStore.getState().clearUser();
    window.location.href = "/";
  },
};
