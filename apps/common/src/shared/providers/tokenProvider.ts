import type { TokenProvider } from "@repo/api";
import { useAuthStore, type AuthUser } from "@shared/providers/store/authStore";

export const tokenProvider: TokenProvider = {
  getAccessToken: () => useAuthStore.getState().accessToken,
  setAccessToken: (token) => {
    useAuthStore.getState().setToken(token);
  },
  getRefreshToken: () => null,
  setUser: (data: AuthUser) => {
    useAuthStore.getState().setUser(data);
  },
};
