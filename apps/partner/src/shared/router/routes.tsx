import { useMemo } from "react";
import { createBrowserRouter, Outlet, useLocation, ScrollRestoration } from "react-router-dom";
import { NotFound } from "@repo/ui";
import OnlyTop from "./layout/page/OnlyTop";
import ProtectedLayout from "./ProtectedLayout";
import PublicLayout from "./PublicLayout";
import SidebarLayout from "@shared/ui/layout/SidebarLayout";
import { publicRoutes, authRoutes } from "./AllRouter";
import { useAuthStore } from "@shared/store/useUserInfoStore";

/**
 * 현재 pathname의 루트 메뉴의 sidebarYn='Y' + 자식이 있을 때만 사이드바 표시.
 * 사이드바 표시 여부는 루트에서만 제어됨.
 */
const ConditionalSidebar = () => {
  const { pathname } = useLocation();
  const menus = useAuthStore((s) => s.user?.menus);

  const showSidebar = useMemo(() => {
    if (!menus?.length) return false;
    const matched = menus
      .filter((m) => m.canRead === "Y" && m.menuUrl && pathname.startsWith(m.menuUrl))
      .sort((a, b) => b.menuUrl.length - a.menuUrl.length)[0];
    if (!matched) return false;
    const byId = new Map(menus.map((m) => [m.menuSeq, m]));
    let cur = matched;
    while (cur.parentMenuSeq) {
      const p = byId.get(cur.parentMenuSeq);
      if (!p) break;
      cur = p;
    }
    if (cur.sidebarYn !== "Y") return false;
    return menus.some((m) => m.parentMenuSeq === cur.menuSeq && m.canRead === "Y");
  }, [menus, pathname]);

  return showSidebar ? <SidebarLayout /> : <Outlet />;
};

export const router = createBrowserRouter([
  {
    element: (
      <>
        <Outlet />
        <ScrollRestoration />
      </>
    ),
    children: [
      // 공개 라우트
      { element: <PublicLayout />, children: publicRoutes },

      // 인증 필요 라우트
      {
        element: <ProtectedLayout />,
        children: [
          {
            element: <OnlyTop />,
            children: [
              {
                element: <ConditionalSidebar />,
                children: authRoutes,
              },
            ],
          },
        ],
      },
    ],
  },

  // 404
  { path: "*", element: <NotFound status={404} /> },
]);
