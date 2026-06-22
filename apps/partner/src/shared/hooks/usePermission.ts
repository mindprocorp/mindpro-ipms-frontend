import { useAuthStore } from "@shared/store/useUserInfoStore";
import { useLocation } from "react-router-dom";
import type { UserResponseType } from "@shared/api/common/commApi";

export interface Permission {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canExcel: boolean;
}

const FULL: Permission = { canRead: true, canWrite: true, canDelete: true, canExcel: true };
const NONE: Permission = { canRead: false, canWrite: false, canDelete: false, canExcel: false };

// ── 내부 유틸 (외부 노출 안 함) ───────────────────────────

type Menu = NonNullable<UserResponseType["menus"]>[number];

const isAdmin = (user: UserResponseType | null): boolean =>
  isSuperAdminUser(user) || user?.adminAuth === "Y";

const isSuperAdminUser = (user: UserResponseType | null): boolean =>
  (user?.role as any)?.type === "SUPER_ADMIN";

/**
 * 현재 사용자가 슈퍼어드민(Mindpro 본사)인지 확인.
 *
 * @example
 * const isSuperAdmin = useIsSuperAdmin();
 * {isSuperAdmin && <Badge>본사</Badge>}
 */
export const useIsSuperAdmin = (): boolean => {
  const user = useAuthStore((s) => s.user);
  return isSuperAdminUser(user);
};

/** pathname에 가장 구체적으로 매칭되는 메뉴 반환 (긴 URL 우선) */
const findMenuByPath = (menus: UserResponseType["menus"], pathname: string): Menu | null => {
  if (!menus?.length) return null;
  return (
    menus
      .filter((m) => m.menuUrl && pathname.startsWith(m.menuUrl))
      .sort((a, b) => b.menuUrl.length - a.menuUrl.length)[0] ?? null
  );
};

const toPermission = (menu: Menu): Permission => ({
  canRead: menu.canRead === "Y",
  canWrite: menu.canWrite === "Y",
  canDelete: menu.canDelete === "Y",
  canExcel: menu.canExcel === "Y",
});

/**
 * 현재 페이지 URL 기반 권한 자동 조회
 *
 * - 관리자 → 모든 권한
 * - 매칭 메뉴 있음 → 해당 메뉴의 CRUD 권한
 * - 매칭 메뉴 없음 → 권한 없음
 *
 * @example
 * const { canWrite, canDelete } = usePagePermission();
 * {canWrite && <Button>저장</Button>}
 */
export const usePagePermission = (): Permission => {
  const user = useAuthStore((s) => s.user);
  const { pathname } = useLocation();
  if (isAdmin(user)) return FULL;
  const menu = findMenuByPath(user?.menus, pathname);
  return menu ? toPermission(menu) : NONE;
};

/**
 * 특정 메뉴 코드 기반 권한 조회
 *
 * 현재 페이지가 아닌 다른 메뉴의 권한을 확인할 때 사용
 *
 * @example
 * const { canWrite } = usePermission("BIZ_MENU_101");
 */
export const usePermission = (menuCd: string): Permission => {
  const user = useAuthStore((s) => s.user);
  if (isAdmin(user)) return FULL;
  const menu = user?.menus?.find((m) => m.menuCd === menuCd);
  return menu ? toPermission(menu) : NONE;
};

/**
 * 현재 라우트 접근 가능 여부 (ProtectedLayout 전용)
 *
 * usePagePermission과의 차이:
 * - 매칭 메뉴 없음 → true (미등록 경로는 차단하지 않음)
 * - 매칭 메뉴 있음 → canRead 확인
 */
export const useRouteAccess = (): boolean => {
  const user = useAuthStore((s) => s.user);
  const { pathname } = useLocation();
  if (isAdmin(user)) return true;
  const menu = findMenuByPath(user?.menus, pathname);
  return menu ? menu.canRead === "Y" : true;
};