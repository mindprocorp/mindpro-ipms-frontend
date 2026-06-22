import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@shared/store/useUserInfoStore";

/**
 * 유저정보가 필요없는 페이지 layout (로그인/회원가입/아이디찾기 등).
 *
 * 보안 정책:
 * - 이미 로그인한 유저가 Login(`/`)이나 Join(`/join`)에 진입 → /dashboard로 리다이렉트
 * - 단, 비밀번호 재설정·OAuth 콜백처럼 진행 중 단계가 있는 페이지는 통과 허용
 */
const REDIRECT_IF_AUTHENTICATED = new Set([
  "/",
  "/join",
  "/complete",
  "/idFind",
  "/pwFind",
]);

const PublicLayout = () => {
  const { pathname } = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated && REDIRECT_IF_AUTHENTICATED.has(pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicLayout;
