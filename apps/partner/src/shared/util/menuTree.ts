/**
 * 메뉴 트리 공통 유틸.
 * 모든 메뉴 렌더링 화면(GNB, 사이드바, 메뉴 관리, 권한 설정 등)이 동일 규칙으로 트리를 구성하도록 통합한다.
 */
import type { MenuVO } from "@shared/api/system/systemApi";

export interface MenuTreeNode {
  menu: MenuVO;
  children: MenuTreeNode[];
}

export interface BuildMenuTreeOptions {
  /** dispType 일치 항목만 포함 (예: "GNB", "ICON_SIDEBAR"). 미지정 시 전체 */
  dispType?: string;
  /** useYn === "N" 항목 제외 여부 (기본 false: 전부 포함, 관리 화면용) */
  excludeDisabled?: boolean;
  /** sidebarYn === "Y"만 포함 여부 (사이드바 전용) */
  sidebarOnly?: boolean;
}

const byDispOrd = (a: MenuTreeNode, b: MenuTreeNode) =>
  Number(a.menu.dispOrd ?? 0) - Number(b.menu.dispOrd ?? 0);

/**
 * 평면 메뉴 배열을 N-level 트리로 변환한다.
 * - 정렬: dispOrd 오름차순 (재귀 적용)
 * - 필터: options.dispType, options.excludeDisabled, options.sidebarOnly
 * - 부모가 필터로 제외되면 그 자손도 제외 (고아 노드 방지)
 */
export const buildMenuTree = (
  menus: MenuVO[],
  options: BuildMenuTreeOptions = {},
): MenuTreeNode[] => {
  const filtered = menus.filter((m) => {
    if (options.dispType && m.dispType !== options.dispType) return false;
    if (options.excludeDisabled && m.useYn === "N") return false;
    if (options.sidebarOnly && m.sidebarYn !== "Y") return false;
    return true;
  });

  const childMap = new Map<string, MenuTreeNode[]>();
  const allNodes = new Map<string, MenuTreeNode>();

  filtered.forEach((m) => {
    const node: MenuTreeNode = { menu: m, children: [] };
    allNodes.set(m.menuSeq, node);
  });

  filtered.forEach((m) => {
    if (!m.parentMenuSeq) return;
    const parent = allNodes.get(m.parentMenuSeq);
    if (!parent) return; // 부모가 필터로 제외된 경우 자손도 제외
    const list = childMap.get(m.parentMenuSeq) ?? [];
    list.push(allNodes.get(m.menuSeq)!);
    childMap.set(m.parentMenuSeq, list);
  });

  allNodes.forEach((node) => {
    const kids = childMap.get(node.menu.menuSeq);
    if (kids) node.children = [...kids].sort(byDispOrd);
  });

  const roots = filtered
    .filter((m) => !m.parentMenuSeq && allNodes.has(m.menuSeq))
    .map((m) => allNodes.get(m.menuSeq)!)
    .sort(byDispOrd);

  return roots;
};

/** 트리에서 특정 노드의 모든 자손 menuSeq 수집 (자기 자신 제외) */
export const collectDescendantSeqs = (node: MenuTreeNode): string[] => {
  const result: string[] = [];
  const walk = (n: MenuTreeNode) => {
    n.children.forEach((c) => {
      result.push(c.menu.menuSeq);
      walk(c);
    });
  };
  walk(node);
  return result;
};

/** 트리 평탄화 (DFS, 정렬 보존) — 일괄 처리용 */
export const flattenMenuTree = (tree: MenuTreeNode[]): MenuVO[] => {
  const result: MenuVO[] = [];
  const walk = (nodes: MenuTreeNode[]) => {
    nodes.forEach((n) => {
      result.push(n.menu);
      walk(n.children);
    });
  };
  walk(tree);
  return result;
};
