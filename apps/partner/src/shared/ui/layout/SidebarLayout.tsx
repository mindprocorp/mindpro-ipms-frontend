import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { cn, CustomScrollArea, Icons } from "@repo/ui";
import { useAuthStore } from "@shared/store/useUserInfoStore";
import { findMenuByPathname, findRootAncestor, resolveIcon, type Menu } from "@shared/ui/layout/menuUtils";

type SidebarNode = Menu & { children: SidebarNode[] };

/**
 * 현재 pathname이 속한 루트 메뉴의 자식 트리를 반환 (루트 자체는 헤더에 표시되므로 제외).
 * - 필터: canRead='Y'
 */
const buildSectionTree = (
  menus: Menu[],
  pathname: string,
): { root: Menu | null; nodes: SidebarNode[] } => {
  const matched = findMenuByPathname(menus, pathname);
  const root = matched ? findRootAncestor(menus, matched.menuSeq) : null;
  if (!root) return { root: null, nodes: [] };

  const active = menus.filter((m) => m.canRead === "Y");
  const build = (parentSeq: string): SidebarNode[] =>
    active
      .filter((m) => m.parentMenuSeq === parentSeq)
      .sort((a, b) => a.dispOrd - b.dispOrd)
      .map((m) => ({ ...m, children: build(m.menuSeq) }));

  return { root, nodes: build(root.menuSeq) };
};

const collectAllSeqs = (nodes: SidebarNode[]): string[] =>
  nodes.flatMap((n) => (n.children.length > 0 ? [n.menuSeq, ...collectAllSeqs(n.children)] : []));

const SidebarItem = ({
  node, depth, pathname, collapsed, onToggle,
}: {
  node: SidebarNode;
  depth: number;
  pathname: string;
  collapsed: Set<string>;
  onToggle: (seq: string) => void;
}) => {
  const Icon = resolveIcon(node.menuIcon);
  const hasChildren = node.children.length > 0;
  const isCollapsed = collapsed.has(node.menuSeq);
  const indentPx = 8 + depth * 12;

  // FOLDER: 그룹 토글
  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          onClick={() => onToggle(node.menuSeq)}
          className="text-text-200 hover:text-text flex w-full cursor-pointer items-center gap-1.5 rounded-md py-1.5 pr-2 text-xs font-medium transition-colors"
          style={{ paddingLeft: indentPx }}
        >
          {Icon && <Icon className="size-3.5 shrink-0" />}
          <span className="flex-1 text-left">{node.menuNm}</span>
          <Icons.ChevronDown
            className={cn("size-3 shrink-0 transition-transform duration-150", isCollapsed && "-rotate-90")}
          />
        </button>
        {!isCollapsed && (
          <div>
            {node.children.map((c) => (
              <SidebarItem
                key={c.menuSeq}
                node={c}
                depth={depth + 1}
                pathname={pathname}
                collapsed={collapsed}
                onToggle={onToggle}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // PAGE: URL 없으면 스킵 (미완성 메뉴 방어)
  if (!node.menuUrl) return null;

  return (
    <NavLink
      to={node.menuUrl}
      end
      className={({ isActive }) =>
        cn(
          "block w-full rounded-md py-1.5 pr-3 text-left text-[13px] transition-colors",
          isActive || pathname === node.menuUrl
            ? "bg-blue-500/10 font-semibold text-blue-600 dark:text-blue-400"
            : "!text-text-200 hover:bg-bg-100 hover:!text-text",
        )
      }
      style={{ paddingLeft: indentPx }}
    >
      {node.menuNm}
    </NavLink>
  );
};

const SIDEBAR_WIDTH = "13rem";
const BREAKPOINT = 2336;

const SidebarLayout = () => {
  const { pathname } = useLocation();
  const { user } = useAuthStore();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const { root: sectionRoot, nodes: tree } = useMemo(
    () => buildSectionTree(user?.menus ?? [], pathname),
    [user?.menus, pathname],
  );

  // 기본값: 전부 펼침 (collapsed = 빈 Set). 사용자가 수동으로 접으면 해당 seq 추가.

  const toggle = (seq: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(seq) ? next.delete(seq) : next.add(seq);
      return next;
    });

  const allCollapsible = useMemo(() => collectAllSeqs(tree), [tree]);
  const toggleAll = () =>
    setCollapsed((prev) => (prev.size === allCollapsible.length ? new Set() : new Set(allCollapsible)));

  // 반응형 마진
  useEffect(() => {
    const pageBody = wrapperRef.current?.parentElement as HTMLElement | null;
    if (!pageBody) return;
    const mql = window.matchMedia(`(max-width: ${BREAKPOINT - 1}px)`);
    const apply = () => {
      pageBody.style.marginLeft = mql.matches ? SIDEBAR_WIDTH : "";
      pageBody.style.marginRight = mql.matches ? "0" : "";
    };
    mql.addEventListener("change", apply);
    apply();
    return () => {
      mql.removeEventListener("change", apply);
      pageBody.style.marginLeft = "";
      pageBody.style.marginRight = "";
    };
  }, []);

  return (
    <div ref={wrapperRef}>
      <nav className="border-border-100 bg-background fixed top-[50px] left-0 z-40 flex h-[calc(100vh-50px)] w-52 flex-col border-r">
        <div className="border-border-100 flex items-center justify-between border-b px-4 py-3">
          <span className="text-text text-[13px] font-bold">{sectionRoot?.menuNm ?? "메뉴"}</span>
          <button
            type="button"
            onClick={toggleAll}
            className="text-text-200 hover:text-text cursor-pointer transition-colors"
            title={collapsed.size === allCollapsible.length ? "모두 펼치기" : "모두 접기"}
          >
            <Icons.ListFilter className="size-3.5" />
          </button>
        </div>

        <CustomScrollArea className="flex-1 px-2 py-2">
          {tree.length === 0 ? (
            <p className="text-text-200 py-6 text-center text-xs">표시할 메뉴가 없습니다.</p>
          ) : (
            tree.map((root) => (
              <SidebarItem
                key={root.menuSeq}
                node={root}
                depth={0}
                pathname={pathname}
                collapsed={collapsed}
                onToggle={toggle}
              />
            ))
          )}
        </CustomScrollArea>

        <div className="border-border-100 text-text-100 border-t px-4 py-3 text-[10px]">
          © Mindpro Corp.
        </div>
      </nav>

      <Outlet />
    </div>
  );
};

export default SidebarLayout;
