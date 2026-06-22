import { Button, Icons } from "@repo/ui";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import type { BoardConfig } from "@shared/api/board/boardConfigApi";
import { boardConfigQueries } from "@shared/query/board/boardConfigQueries";
import { BoardSelectModal } from "../BoardSelectModal";

const filterReadable = (nodes: BoardConfig[]): BoardConfig[] =>
  nodes.flatMap((n) => {
    if (n.boardType === "BOARD") return n.canRead === false ? [] : [n];
    const children = filterReadable(n.children ?? []);
    return children.length > 0 ? [{ ...n, children }] : [];
  });

const FAV_STORAGE_KEY = "board_favorites";

const loadFavorites = (): BoardConfig[] => {
  try {
    return JSON.parse(localStorage.getItem(FAV_STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
};

const saveFavorites = (favs: BoardConfig[]) => {
  localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(favs));
};

// ─── 트리 노드 ──────────────────────────────────────────────────────────────
const TreeNode = ({
  node,
  depth = 0,
  onBoardClick,
  favorites,
  onToggleFav,
}: {
  node: BoardConfig;
  depth?: number;
  onBoardClick: (node: BoardConfig) => void;
  favorites: BoardConfig[];
  onToggleFav: (node: BoardConfig) => void;
}) => {
  const [open, setOpen] = useState(true);
  const isCategory = node.boardType === "CATEGORY";
  const isBoard = node.boardType === "BOARD";
  const isFav = favorites.some((f) => f.configSeq === node.configSeq);

  return (
    <div>
      {isCategory ? (
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          style={{ paddingLeft: `${0.5 + depth * 0.75}rem` }}
          className="flex w-full items-center gap-1.5 py-1.5 pr-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <Icons.Folder className="size-3.5 shrink-0 text-amber-500" />
          <span className="flex-1 text-left">{node.boardName}</span>
          <Icons.ChevronDown
            className={`size-3 shrink-0 transition-transform ${open ? "" : "-rotate-90"}`}
          />
        </button>
      ) : isBoard ? (
        <div
          style={{ paddingLeft: `${0.75 + depth * 0.75}rem` }}
          className="group flex w-full items-center gap-1.5 rounded-sm pr-1 hover:bg-muted/60"
        >
          <button
            type="button"
            onClick={() => onBoardClick(node)}
            className="flex flex-1 items-center gap-1.5 py-1.5 text-sm text-foreground/80 group-hover:text-foreground"
          >
            <Icons.FileText className="size-3.5 shrink-0 text-muted-foreground" />
            {node.boardName}
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggleFav(node); }}
            className={`shrink-0 rounded p-0.5 transition-colors ${
              isFav
                ? "text-amber-400"
                : "text-transparent group-hover:text-muted-foreground hover:!text-amber-400"
            }`}
            title={isFav ? "즐겨찾기 해제" : "즐겨찾기 추가"}
          >
            <Icons.Star className={`size-3.5 ${isFav ? "fill-amber-400" : ""}`} />
          </button>
        </div>
      ) : null}

      {isCategory && open && node.children?.map((child) => (
        <TreeNode
          key={child.configSeq}
          node={child}
          depth={depth + 1}
          onBoardClick={onBoardClick}
          favorites={favorites}
          onToggleFav={onToggleFav}
        />
      ))}
    </div>
  );
};

// ─── 레이아웃 ───────────────────────────────────────────────────────────────
const BoardLayout = () => {
  const navigate = useNavigate();

  const [treeData, setTreeData] = useState<BoardConfig[]>([]);
  const [favorites, setFavorites] = useState<BoardConfig[]>(loadFavorites);
  const [treeSearch, setTreeSearch] = useState("");
  const [treeCollapsed, setTreeCollapsed] = useState(false);
  const [favCollapsed, setFavCollapsed] = useState(false);
  const [writeSelectOpen, setWriteSelectOpen] = useState(false);

  const getTreeMut = useMutation(boardConfigQueries.getListMut());

  useEffect(() => {
    getTreeMut.mutate({}, {
      onSuccess: (res) => {
        const raw = res.data;
        const list: BoardConfig[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.list)
          ? raw.list
          : [];
        setTreeData(filterReadable(list));
      },
    });
  }, []);

  const toggleFav = (node: BoardConfig) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.configSeq === node.configSeq);
      const next = exists
        ? prev.filter((f) => f.configSeq !== node.configSeq)
        : [...prev, node];
      saveFavorites(next);
      return next;
    });
  };

  const safeTree = Array.isArray(treeData) ? treeData : [];

  const filterTree = (nodes: BoardConfig[], keyword: string): BoardConfig[] =>
    nodes.flatMap((n) => {
      if (n.boardType === "BOARD") return n.boardName?.includes(keyword) ? [n] : [];
      const children = filterTree(n.children ?? [], keyword);
      return children.length > 0 ? [{ ...n, children }] : [];
    });

  const filteredTree = treeSearch ? filterTree(safeTree, treeSearch) : safeTree;

  return (
    <div className="flex min-h-0 min-w-0 flex-1">
      {/* ── 좌측 사이드바 ── */}
      <aside className="flex h-[calc(100vh-50px)] w-60 shrink-0 flex-col overflow-y-auto border-r bg-background">
        {/* 글쓰기 버튼 */}
        <div className="p-3">
          <Button
            variant="blue"
            size="h36"
            className="w-full"
            onClick={() => setWriteSelectOpen(true)}
          >
            <Icons.Plus className="size-4" />
            글쓰기
          </Button>
        </div>

        {/* 필터 탭 */}
        <div className="flex justify-around border-b px-2 pb-3">
          {[
            { icon: <Icons.Clock className="size-4" />, label: "최신글", badge: true, to: "/board/list" },
            { icon: <Icons.User className="size-4" />, label: "내 게시글", to: "/board/list?filter=mine" },
          ].map((tab) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => navigate(tab.to)}
              className="flex flex-col items-center gap-0.5 rounded p-1.5 text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              <div className="relative">
                {tab.icon}
                {/* 미읽음 카운트 개발 후 주석 해제
                {"badge" in tab && tab.badge && (
                  <span className="absolute -right-1.5 -top-1.5 flex size-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white">
                    0
                  </span>
                )} */}
              </div>
              <span className="text-[10px]">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 게시판 이름 검색 */}
        <div className="px-3 py-2">
          <div className="flex items-center gap-1.5 rounded-md border border-input bg-muted/30 px-2.5 py-1.5">
            <Icons.Search className="size-3.5 shrink-0 text-muted-foreground" />
            <input
              value={treeSearch}
              onChange={(e) => setTreeSearch(e.target.value)}
              placeholder="게시판 이름으로 검색"
              className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* 게시판 메인 */}
        <div className="px-3 py-1">
          <NavLink
            to="/board"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors ${
                isActive
                  ? "bg-blue-500/10 font-semibold text-blue-600 dark:text-blue-400"
                  : "text-foreground hover:bg-muted/60"
              }`
            }
          >
            <Icons.LayoutGrid className="size-4 shrink-0" />
            게시판 메인
          </NavLink>
        </div>

        <div className="my-2 border-t" />

        {/* 즐겨찾기 */}
        <div className="px-3">
          <button
            type="button"
            onClick={() => setFavCollapsed((p) => !p)}
            className="flex w-full items-center gap-1 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <Icons.ChevronDown
              className={`size-3.5 transition-transform ${favCollapsed ? "-rotate-90" : ""}`}
            />
            즐겨찾기
          </button>
          {!favCollapsed && (
            <div className="pb-2 pt-1">
              {favorites.length === 0 ? (
                <div className="flex flex-col items-center gap-1 py-3 pl-3 text-center">
                  <Icons.Star className="size-5 text-muted-foreground/40" />
                  <p className="text-[11px] text-muted-foreground">
                    자주 찾는 게시판의 이름 옆 별 아이콘을
                    <br />
                    클릭하면 즐겨찾기로 추가할 수 있어요.
                  </p>
                </div>
              ) : (
                <div className="space-y-0.5 pl-2">
                  {favorites.map((fav) => (
                    <div key={fav.configSeq} className="group flex items-center gap-1 rounded-sm pr-1 hover:bg-muted/60">
                      <button
                        type="button"
                        onClick={() => navigate(`/board/list?configSeq=${fav.configSeq}&boardName=${encodeURIComponent(fav.boardName ?? "")}`)}
                        className="flex flex-1 items-center gap-1.5 py-1.5 pl-2 text-sm text-foreground/80 group-hover:text-foreground"
                      >
                        <Icons.FileText className="size-3.5 shrink-0 text-muted-foreground" />
                        {fav.boardName}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleFav(fav)}
                        className="shrink-0 rounded p-0.5 text-amber-400 hover:text-muted-foreground"
                        title="즐겨찾기 해제"
                      >
                        <Icons.Star className="size-3.5 fill-amber-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="my-2 border-t" />

        {/* 전체 게시판 */}
        <div className="px-3 pb-4">
          <button
            type="button"
            onClick={() => setTreeCollapsed((p) => !p)}
            className="flex w-full items-center gap-1 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <Icons.ChevronDown
              className={`size-3.5 transition-transform ${treeCollapsed ? "-rotate-90" : ""}`}
            />
            전체 게시판
          </button>
          {!treeCollapsed && (
            <div className="pt-1">
              {filteredTree.map((node) => (
                <TreeNode
                  key={node.configSeq}
                  node={node}
                  onBoardClick={(node) => navigate(`/board/list?configSeq=${node.configSeq}&boardName=${encodeURIComponent(node.boardName ?? "")}`)}
                  favorites={favorites}
                  onToggleFav={toggleFav}
                />
              ))}
              {!filteredTree.length && (
                <p className="py-2 pl-3 text-xs text-muted-foreground">게시판이 없습니다.</p>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* ── 페이지 콘텐츠 ── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <Outlet context={{ treeData: safeTree }} />
      </div>

      <BoardSelectModal
        open={writeSelectOpen}
        onOpenChange={setWriteSelectOpen}
        onConfirm={(board) => {
          navigate(
            `/board/write?configSeq=${board.configSeq}&boardName=${encodeURIComponent(board.boardName ?? "")}`
          );
        }}
      />
    </div>
  );
};

export default BoardLayout;
