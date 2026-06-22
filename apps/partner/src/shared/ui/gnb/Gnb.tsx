import { cn, Icons, useTheme } from "@repo/ui";
import Logo from "@shared/assets/IPMS.svg?react";
import OrganiButton from "@widgets/organization/ui/OrganiButton";
// import NotiButton from "@widgets/notification/ui/NotiButton"; // 알림 — 추후 활성화
import { UserDropDown } from "@widgets/avata-with-dropdown/ui";
import OfficeSwitcher from "@widgets/office-switcher/OfficeSwitcher";
import { useNavigate, useLocation } from "react-router-dom";
import Theme from "@shared/theme/Theme";
// import LangChoice from "@shared/locales/LangChoice"; // 다국어 드롭다운 — 추후 활성화 (현재 KO 고정)
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuthStore } from "@shared/store/useUserInfoStore";
import { buildMenuTree, findMenuByPathname, findRootAncestor, resolveIcon, resolveTargetUrl, type MenuItem } from "@shared/ui/layout/menuUtils";

/**
 * pathname이 base 경로와 동일하거나 그 하위에 있는지 확인.
 * startsWith 단순 비교의 false-positive("/settings"가 "/settings-other"에 매칭되는 문제) 방지.
 */
const isUnder = (pathname: string, base: string): boolean => {
  if (!base) return false;
  const normalized = base.endsWith("/") ? base : `${base}/`;
  return pathname === base || pathname.startsWith(normalized);
};

/**
 * leaf PAGE URL에서 섹션 기준 경로 추출.
 * "/settings/member/list" → "/settings/member"
 * 단일 세그먼트("/settings")는 그대로 반환.
 */
const toSectionBase = (url: string): string => {
  const segs = url.split("/").filter(Boolean);
  return segs.length > 1 ? `/${segs.slice(0, -1).join("/")}` : url;
};

/**
 * FOLDER 타입을 재귀 탐색해 PAGE leaf 항목만 평탄화 추출.
 * URL 없는 PAGE는 제외 (미완성 메뉴 방어).
 */
const extractPages = (items: MenuItem[]): MenuItem[] => {
  const result: MenuItem[] = [];
  for (const item of items) {
    if (item.menuType === "FOLDER") {
      result.push(...extractPages(item.children));
    } else if (item.menuUrl) {
      result.push({ ...item, children: [] });
    }
  }
  return result;
};

const Gnb = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useTheme();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const gnbRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);

  const allTree = useMemo(() => buildMenuTree(user?.menus), [user?.menus]);

  // GNB 좌측: dispType=GNB
  // FOLDER 하위 구조를 재귀 평탄화해 PAGE leaf만 드롭다운에 노출
  const gnbTree = useMemo(
    () =>
      allTree
        .filter((m) => m.dispType === "GNB")
        .map((root) => ({ ...root, children: extractPages(root.children) })),
    [allTree],
  );

  // GNB 우측 아이콘: dispType=ICON_SIDEBAR, 최상위(루트)만
  const iconMenus = useMemo(
    () => allTree.filter((m) => m.dispType === "ICON_SIDEBAR"),
    [allTree],
  );

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (gnbRef.current && !gnbRef.current.contains(e.target as Node))
        setOpenMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isGnbActive = (item: MenuItem): boolean => item.menuSeq === activeRootSeq;

  // 현재 pathname의 메뉴 루트 조상 — GNB/아이콘 active 판정의 단일 기준
  const activeRootSeq = useMemo(() => {
    const matched = findMenuByPathname(user?.menus, location.pathname);
    return matched ? findRootAncestor(user?.menus, matched.menuSeq)?.menuSeq ?? null : null;
  }, [user?.menus, location.pathname]);

  const isIconActive = (item: MenuItem): boolean => item.menuSeq === activeRootSeq;

  /**
   * 메뉴 클릭 = 해당 메뉴의 "대표 URL"로 이동 (단일 플로우).
   * - GNB 좌측은 자식이 있는 FOLDER일 때만 드롭다운 토글을 우선시한다 (UX 유지).
   * - 이 외 모든 경우는 resolveTargetUrl로 이동.
   */
  const navigateToMenu = (item: MenuItem) => {
    const url = resolveTargetUrl(item);
    if (!url) return;
    navigate(url);
    setOpenMenu(null);
  };

  const handleGnbClick = (item: MenuItem) => {
    // 자식이 있는 FOLDER: 드롭다운 토글 (GNB 좌측 UX)
    if (item.children.length > 0) {
      setOpenMenu(openMenu === item.menuSeq ? null : item.menuSeq);
      return;
    }
    navigateToMenu(item);
  };

  /**
   * 트리에서 가장 먼저 만나는 leaf(PAGE + URL)의 URL을 찾는다.
   * 자식이 있으면 자식부터 깊이 우선 탐색하므로, 루트에 URL이 있어도 무시하고 깊은 곳의 첫 페이지로 이동.
   */
  const findDeepestFirstUrl = (item: MenuItem): string | null => {
    if (item.children && item.children.length > 0) {
      for (const c of item.children) {
        const u = findDeepestFirstUrl(c);
        if (u) return u;
      }
    }
    return item.menuUrl || null;
  };

  // ICON_SIDEBAR 아이콘 클릭: 깊이 상관없이 가장 첫 PAGE로 이동
  const handleIconClick = (item: MenuItem) => {
    const url = findDeepestFirstUrl(item);
    if (!url) return;
    navigate(url);
    setOpenMenu(null);
  };

  return (
    <div className="border-border-200 to-p-color-3 dark:border-input fixed z-50 flex w-full justify-between border-b bg-linear-to-r from-[#20327B] px-4">
      {/* 좌측: 로고 + GNB 메뉴 */}
      <div className="flex items-center gap-2" ref={gnbRef}>
        <Logo className="size-12 text-white" />
        <nav className="flex items-center">
          {gnbTree.map((item) => (
            <div key={item.menuSeq} className="relative">
              <button
                type="button"
                onClick={() => handleGnbClick(item)}
                className={cn(
                  "cursor-pointer rounded-sm px-3 py-1.5 text-sm font-medium text-white/50 transition-colors hover:text-white",
                  (isGnbActive(item) || openMenu === item.menuSeq) && "text-white",
                )}
              >
                {item.menuNm}
              </button>

              {item.children.length > 0 && openMenu === item.menuSeq && (
                <div className="bg-popover text-popover-foreground absolute top-full left-0 z-50 mt-1 min-w-40 rounded-md border p-1 shadow-md">
                  {item.children.map((child) => (
                    <button
                      type="button"
                      key={child.menuSeq}
                      onClick={() => {
                        navigate(child.menuUrl);
                        setOpenMenu(null);
                      }}
                      className="hover:bg-accent hover:text-accent-foreground w-full cursor-pointer rounded-sm px-3 py-1.5 text-left text-sm transition-colors"
                    >
                      {child.menuNm}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* 우측: ICON_SIDEBAR 아이콘 + 기타 버튼 */}
      <div className="flex items-center gap-1">
        {iconMenus.map((item) => {
          const Icon = resolveIcon(item.menuIcon);
          return (
            <button
              key={item.menuSeq}
              type="button"
              title={item.menuNm}
              onClick={() => handleIconClick(item)}
              className={cn(
                "flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-white/20",
                isIconActive(item) && "bg-white/20",
              )}
            >
              {Icon ? (
                <Icon className="size-4 text-white" />
              ) : (
                <span className="text-[10px] font-medium text-white">
                  {item.menuNm.charAt(0)}
                </span>
              )}
            </button>
          );
        })}

        <div className="mx-1 h-5 w-px bg-white/20" />
        <OfficeSwitcher />
        <div className="mx-1 h-5 w-px bg-white/20" />
        <OrganiButton />
        {/* <NotiButton /> 알림 — 추후 활성화 */}
        <UserDropDown />
        <Theme className="border-none bg-transparent p-1 hover:bg-white/20 [&>svg]:text-white!" />
        {/* 다국어 드롭다운 활성화 시 LangChoice 사용. 현재는 KO 고정 표시만. */}
        <span className="flex items-center gap-1 px-2 text-xs text-white/80">
          <Icons.Earth className="size-3.5" /> KO
        </span>
      </div>
    </div>
  );
};

export default Gnb;
