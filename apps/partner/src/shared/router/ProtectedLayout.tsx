import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@shared/store/useUserInfoStore.ts";
import { useMutation } from "@tanstack/react-query";
import { commonQueries } from "@shared/query/common/queries.ts";
import { NotFound } from "@repo/ui";
import { AiChatAgent } from "../../ai/AiChatAgent";
import { useRouteAccess } from "@shared/hooks/usePermission";

/**
 * 유저정보가 필요한 페이지 layout
 * 1. 토큰 없으면 → 로그인 페이지로
 * 2. 토큰 있으면 → /api/common/me 1회 호출 → user+menus 로드
 *    - network error 는 axios interceptor + 전역 NotFound 가 처리 (App.tsx)
 *    - HTTP error 는 여기서 NotFound 렌더 (사용자가 새로고침하면 재시도)
 * 3. 로드 완료 후 → 경로별 권한 체크 → 페이지 렌더링
 *
 * 401 은 axios interceptor 의 proactive/reactive refresh 로 일관 처리.
 * 진짜 인증 실패면 tokenProvider.onUnauthorized 가 로그인 페이지로 보냄.
 */
const ProtectedLayout = () => {
  const { user, isAuthenticated, setUser } = useAuthStore();
  const hasAccess = useRouteAccess();
  const location = useLocation();

  const [meError, setMeError] = useState<{ status?: number; code?: string; message?: string } | null>(null);

  const getUserInfoMutation = useMutation({
    ...commonQueries.getUserInfo(),
    onSuccess: (res) => setUser(res.data),
    onError: (err: any) => {
      setMeError({
        status: err?.status,
        code: err?.code,
        message: err?.message,
      });
    },
  });

  // 마운트당 1회만 시도 — 실패 시 사용자가 새로고침하면 재시도
  const triedRef = useRef(false);
  useEffect(() => {
    if (!isAuthenticated || user || triedRef.current) return;
    triedRef.current = true;
    getUserInfoMutation.mutate(undefined);
  }, [isAuthenticated, user]);

  // 토큰 없으면 로그인 페이지로 — 진입 시도한 URL을 state에 보존하여 로그인 후 복원
  if (!isAuthenticated) {
    const from = location.pathname + location.search;
    return <Navigate to="/" replace state={{ from }} />;
  }

  // /me 실패 → 표준 에러 화면 (백엔드 message 우선, axios 영문 fallback 은 무시)
  if (meError) {
    const hasUsefulMessage = meError.message && meError.message !== "Network Error";
    return (
      <NotFound
        title={hasUsefulMessage ? meError.message! : "사용자 정보를 불러올 수 없습니다"}
        description={hasUsefulMessage ? undefined : "잠시 후 다시 시도해주세요."}
        status={meError.status}
        errorCode={meError.code}
        showReload
      />
    );
  }

  // user 로딩 중 (토큰은 있지만 user가 아직 null)
  if (!user) return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <div className="relative flex items-center justify-center">
        <div className="absolute size-16 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
        <div className="absolute size-16 animate-spin rounded-full border-4 border-transparent border-b-blue-400" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
        <div className="size-8 rounded-full bg-blue-600/10" />
      </div>
      <p className="text-sm font-medium text-gray-500 animate-pulse">사용자 정보를 불러오고 있습니다</p>
    </div>
  );

  // 라우트 권한 체크
  if (!hasAccess) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">접근 권한이 없습니다</h1>
        <p className="text-gray-500">관리자에게 문의하세요.</p>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          이전 페이지로
        </button>
      </div>
    );
  }

  return (
    <>
      <Outlet />
      <AiChatAgent />
    </>
  );
};

export default ProtectedLayout;
