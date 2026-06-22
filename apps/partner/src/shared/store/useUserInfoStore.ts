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
  updateMenus: (menus: UserResponseType["menus"]) => void;
  refreshUser: () => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  user: null,
  isAuthenticated: !!localStorage.getItem("accessToken"),

  setToken: (t) => {
    if (t) localStorage.setItem("accessToken", t);
    else localStorage.removeItem("accessToken");

    set({ accessToken: t, isAuthenticated: !!t });
  },
  setRefreshToken: (t) => {
    if (t) localStorage.setItem("refreshToken", t);
    else localStorage.removeItem("refreshToken");

    set({ refreshToken: t });
  },

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  // menus만 갱신 (화면 유지)
  updateMenus: (menus) =>
    set((state) => ({
      user: state.user ? { ...state.user, menus } : null,
    })),

  // user 전체 재로드 (ProtectedLayout이 /api/common/me 재호출)
  refreshUser: () => set({ user: null }),

  clearUser: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
  },
}));
