// store/auth.store.ts
import { create } from "zustand";
import type { UserResponseType } from "@shared/api/common/commApi.ts";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserResponseType | null;
  isAuthenticated: boolean;

  setToken: (t: string | null) => void;
  setRefreshToken: (t: string | null) => void;
  setUser: (user: UserResponseType) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  user: null,
  isAuthenticated: false,

  setToken: (t) => {
    if (t) localStorage.setItem("accessToken", t);
    else localStorage.removeItem("accessToken");

    set({ accessToken: t, isAuthenticated: false });
  },
  setRefreshToken: (t) => {
    if (t) localStorage.setItem("refreshToken", t);
    else localStorage.removeItem("refreshToken");

    set({ refreshToken: t, isAuthenticated: false });
  },

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  clearUser: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
}));
