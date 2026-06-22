import * as LucideIcons from "lucide-react";
import type { UserResponseType } from "@shared/api/common/commApi";

export type Menu = NonNullable<UserResponseType["menus"]>[number];
export type MenuItem = Menu & { children: MenuItem[] };

export const resolveIcon = (name?: string): LucideIcons.LucideIcon | null =>
  name ? ((LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[name] ?? null) : null;

/** flat list → 권한 있는 메뉴 트리 */
export const buildMenuTree = (menus: Menu[] | undefined): MenuItem[] => {
  if (!menus?.length) return [];
  const active = menus.filter((m) => m.canRead === "Y");
  const map = new Map<string, MenuItem>();
  for (const m of active) map.set(m.menuSeq, { ...m, children: [] });
  const roots: MenuItem[] = [];
  for (const item of map.values()) {
    if (item.parentMenuSeq && map.has(item.parentMenuSeq)) {
      map.get(item.parentMenuSeq)!.children.push(item);
    } else if (!item.parentMenuSeq) {
      roots.push(item);
    }
  }
  const sortRecursive = (items: MenuItem[]) => {
    items.sort((a, b) => a.dispOrd - b.dispOrd);
    items.forEach((item) => sortRecursive(item.children));
  };
  sortRecursive(roots);
  return roots;
};

/**
 * 메뉴의 "대표 URL"을 구한다.
 * - 자신의 menuUrl이 있으면 그 값
 * - 없으면 children을 dispOrd 순으로 DFS 내려가면서 처음 만나는 URL
 * - 모든 후손에도 URL이 없으면 null
 *
 * FOLDER/PAGE, URL 유무 상관없이 "데이터가 가리키는 실제 도착지"를 단일하게 해결.
 */
export const resolveTargetUrl = (item: MenuItem): string | null => {
  if (item.menuUrl) return item.menuUrl;
  for (const child of item.children ?? []) {
    const url = resolveTargetUrl(child);
    if (url) return url;
  }
  return null;
};

/**
 * flat 메뉴 배열에서 주어진 pathname에 가장 구체적으로 매칭되는 메뉴를 찾는다.
 * - menuUrl이 pathname의 prefix인 메뉴 중 가장 긴 것
 */
export const findMenuByPathname = (
  menus: Menu[] | undefined,
  pathname: string,
): Menu | null => {
  if (!menus?.length) return null;
  return (
    menus
      .filter((m) => m.menuUrl && pathname.startsWith(m.menuUrl))
      .sort((a, b) => b.menuUrl.length - a.menuUrl.length)[0] ?? null
  );
};

/**
 * 특정 메뉴의 루트 조상(parentMenuSeq가 없는 최상위)을 반환.
 * 메뉴 자체가 루트면 자기 자신을 반환.
 */
export const findRootAncestor = (
  menus: Menu[] | undefined,
  menuSeq: string,
): Menu | null => {
  if (!menus?.length) return null;
  const byId = new Map(menus.map((m) => [m.menuSeq, m]));
  let cur = byId.get(menuSeq);
  if (!cur) return null;
  while (cur.parentMenuSeq) {
    const parent = byId.get(cur.parentMenuSeq);
    if (!parent) break;
    cur = parent;
  }
  return cur;
};

