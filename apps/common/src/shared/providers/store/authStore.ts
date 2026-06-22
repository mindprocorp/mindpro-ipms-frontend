import { create } from "zustand";

const ROLE_TYPE = {
  ADMIN: "admin",
  USER: "ROLE_USER",
};

export type UserRole = "ROLE_CROP" | "ROLE_USER";

export interface AuthUser {
  userId: string;
  userNm: string;
  userRole: UserRole;
}

type AuthState = {
  accessToken: string | null;
  isAuthed: boolean;
  setToken: (t: string | null) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
  user: AuthUser;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("accessToken"),
  isAuthed: !!localStorage.getItem("accessToken"),
  user: {
    userId: "",
    userNm: "",
    userRole: "ROLE_USER",
  },

  setToken: (t) => {
    if (t) localStorage.setItem("accessToken", t);
    else localStorage.removeItem("accessToken");

    set({ accessToken: t, isAuthed: !!t });
  },

  setUser: (user) => {
    if (user) {
      localStorage.setItem("userId", user.userId);
      localStorage.setItem("userNm", user.userNm);
      localStorage.setItem("userRole", user.userRole);
      set({ user: { userId: user.userId, userNm: user.userNm, userRole: user.userRole } });
    } else {
      alert("remove localstorage");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("userNm");
      localStorage.removeItem("userRole");
    }
  },

  logout: () => {
    alert("remove localstorage");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userNm");
    localStorage.removeItem("userRole");
    set({ accessToken: null, isAuthed: false });
    set({ user: { userId: "", userNm: "", userRole: "ROLE_USER" } });
  },
}));
