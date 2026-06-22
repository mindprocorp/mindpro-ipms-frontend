import { apiClient } from "@shared/api/client";
import { commAPI } from "@shared/api/common/commApi";
import { useAuthStore } from "@shared/store/useUserInfoStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

/**
 * 토큰 교체 후 user 정보 직접 fetch — null 거치지 않아 ProtectedLayout race 방지.
 * /api/common/me 실패 시 onError → clearUser() 트리거되는 로그아웃 사고 차단.
 */
async function reloadUserSafely(setUser: (u: any) => void) {
  try {
    const res = await commAPI(apiClient).getUserInfo();
    if (res?.data) setUser(res.data);
  } catch {
    /* 실패해도 기존 user 유지 (로그아웃하지 않음) */
  }
}

// ─── 타입 ─────────────────────────────────────────────────

export interface MyOffice {
  officeSeq: string;
  officeShortName: string;
  officeAuthYn: "Y" | "N";
  adminAuth: "Y" | "N";
  roleNm: string | null;
  roleType: "SUPER_ADMIN" | "SYSTEM_ADMIN" | "SYSTEM_USER" | "CUSTOM" | null;
  acctStatusCode: "ACTIVE" | "PENDING" | "LOCKED" | null;
  isCurrent: boolean;
}

export interface SwitchOfficeResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userInfoSeq: string;
  userMstSeq: string;
  officeSeq: string;
  userRole: string;
}

// ─── 훅 ───────────────────────────────────────────────────

export const officeMembershipApi = {
  /** 내가 속한 활성/대기 사무소 목록 (드롭다운용) */
  useMyOffices: () =>
    useQuery({
      queryKey: ["myOffices"],
      queryFn: async () => {
        const { data } = await apiClient.axios.get<{ data: MyOffice[] }>("/api/users/my-offices");
        return data.data;
      },
      staleTime: 30_000,
    }),

  /** 사무소 전환 — 새 JWT로 교체 후 홈으로 이동 */
  useSwitchOffice: () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { setToken, setRefreshToken, setUser } = useAuthStore();

    return useMutation({
      mutationFn: async (officeSeq: string) => {
        const { data } = await apiClient.axios.post<{ data: SwitchOfficeResponse }>(
          `/api/users/switch-office/${officeSeq}`,
        );
        return data.data;
      },
      onSuccess: async (res) => {
        // 새 JWT 적용 → 기존 캐시 먼저 비움(stale 방지) → 새 user 로드 → 이동.
        // 순서 핵심: clear()가 reload보다 먼저여야 새 office 권한 기준으로만 데이터가 쌓임.
        setToken(res.accessToken);
        setRefreshToken(res.refreshToken);
        queryClient.clear();
        await reloadUserSafely(setUser);
        navigate("/dashboard");
      },
    });
  },

  /** 초대코드로 사무소 합류 (관리자 승인 대기) */
  useJoinOffice: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (inviteCode: string) => {
        const { data } = await apiClient.axios.post<{ data: string }>("/api/users/join-office", {
          inviteCode,
        });
        return data.data; // officeSeq
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["myOffices"] });
      },
    });
  },

  /** 사무소 탈퇴 — 비밀번호 검증 필수. 현재 접속 사무소면 자동 전환 + 새 JWT */
  useLeaveOffice: () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { setToken, setRefreshToken, setUser } = useAuthStore();

    return useMutation({
      mutationFn: async ({ officeSeq, password }: { officeSeq: string; password: string }) => {
        const { data } = await apiClient.axios.post<{ data: SwitchOfficeResponse | null }>(
          `/api/users/leave-office/${officeSeq}`,
          { password },
        );
        return data.data;
      },
      onSuccess: async (res) => {
        if (res) {
          setToken(res.accessToken);
          setRefreshToken(res.refreshToken);
          await reloadUserSafely(setUser);
          queryClient.clear();
          navigate("/dashboard");
        } else {
          queryClient.invalidateQueries({ queryKey: ["myOffices"] });
        }
      },
    });
  },

  /** [하이브리드] 유일 회사 탈퇴 + 개인회원으로 전환 — 새 JWT로 교체 */
  useLeaveToPersonal: () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { setToken, setRefreshToken, setUser } = useAuthStore();

    return useMutation({
      mutationFn: async ({ officeSeq, password }: { officeSeq: string; password: string }) => {
        const { data } = await apiClient.axios.post<{ data: SwitchOfficeResponse }>(
          `/api/users/leave-to-personal/${officeSeq}`,
          { password },
        );
        return data.data;
      },
      onSuccess: async (res) => {
        setToken(res.accessToken);
        setRefreshToken(res.refreshToken);
        await reloadUserSafely(setUser);
        queryClient.clear();
        navigate("/dashboard");
      },
    });
  },

  /** [하이브리드] 계정 완전 탈퇴 — 성공 시 로컬 토큰 삭제 후 로그인 페이지로 */
  useCloseAccount: () => {
    const navigate = useNavigate();
    const { clearUser } = useAuthStore();
    return useMutation({
      mutationFn: async (password: string) => {
        await apiClient.axios.post("/api/users/close-account", { password });
      },
      onSuccess: () => {
        clearUser();
        navigate("/"); // 계정 탈퇴 — 로그인 페이지로
      },
    });
  },

  /** (관리자) PENDING 직원 승인 — 역할 + 직원정보 필수 */
  useApproveEmployee: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({
        userMstSeq,
        body,
      }: {
        userMstSeq: string;
        body: ApproveEmployeeBody;
      }) => {
        await apiClient.axios.post(`/api/users/approve/${userMstSeq}`, body);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["myOffices"] });
        queryClient.invalidateQueries({ queryKey: ["pendingEmployees"] });
      },
    });
  },
};

export interface ApproveEmployeeBody {
  roleSeq: string;                   // 필수
  officeEmployeePosition?: string;
  officeEmployeeDept?: string;
  deptSeq?: string;
  workCode?: string;
  positionCode?: string;
  jobGradeCode?: string;
  userTypeCode?: string;
  workStatusCode?: string;
  employStatusCode?: string;
}
