import { Button, Icons } from "@repo/ui";
import ListResultHeader from "@shared/ui/ListResultHeader";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { boardApi, type BoardListItem, type BoardMainItem } from "@shared/api/board/boardApi";
import { apiClient } from "@shared/api/client";
import { SettingsBar, BarSearch, BarLabel } from "@pages/settings/_components/common/SettingsBar";
import SelectBox from "@pages/settings/_components/common/SelectBox";

const SEARCH_TYPES = [
  { value: "title",          label: "제목" },
  { value: "content",        label: "내용" },
  { value: "createUserName", label: "작성자" },
];


const fmtDate = (d: string) =>
  d ? `${d.slice(0, 4)}. ${d.slice(5, 7)}. ${d.slice(8, 10)}.` : "";

const isActivePinned = (item: { isPinned: string; pinnedEndAt?: string }) => {
  if (item.isPinned !== "Y") return false;
  if (!item.pinnedEndAt || item.pinnedEndAt.length !== 8) return true;
  const r = item.pinnedEndAt;
  return `${r.slice(0, 4)}-${r.slice(4, 6)}-${r.slice(6, 8)}` >= new Date().toISOString().slice(0, 10);
};

// ─── 일반 게시판 행 ───────────────────────────────────────────────────────────
const PostRow = ({
  item,
  showCategory,
  onClick,
}: {
  item: BoardListItem;
  showCategory?: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full items-center gap-2 rounded px-1 py-2 text-left transition-colors hover:bg-muted/50 group"
  >
    {isActivePinned(item) && (
      <span className="shrink-0 rounded-sm bg-rose-500/10 px-1 py-0.5 text-[9px] font-bold text-rose-500">
        공지
      </span>
    )}
    {item.tags?.slice(0, 1).map((t) => (
      <span key={t} className="shrink-0 rounded-full bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">
        {t}
      </span>
    ))}
    <div className="flex flex-1 items-center gap-1.5 min-w-0">
      <span className="truncate text-sm font-medium text-foreground group-hover:text-primary">
        {item.title}
      </span>
      {item.hasFile === "Y" && (
        <Icons.Paperclip className="size-3 shrink-0 text-muted-foreground/60" />
      )}
    </div>
    {showCategory && item.category?.codeName && (
      <span className="shrink-0 rounded border border-border px-1 py-0.5 text-[10px] text-muted-foreground">
        {item.category.codeName}
      </span>
    )}
    <span className="shrink-0 text-xs text-muted-foreground">{item.createUser?.userName}</span>
    <span className="shrink-0 text-xs text-muted-foreground">{fmtDate(item.createAt)}</span>
    {item.viewCount > 0 && (
      <span className="shrink-0 flex items-center gap-0.5 text-xs text-muted-foreground">
        <Icons.Eye className="size-3" /> {item.viewCount}
      </span>
    )}
    {(item.commentCount ?? 0) > 0 && (
      <span className="shrink-0 flex items-center gap-0.5 text-xs text-muted-foreground">
        <Icons.MessageSquare className="size-3" /> {item.commentCount}
      </span>
    )}
  </button>
);

// ─── 검색 결과 행 ─────────────────────────────────────────────────────────────
const SearchResultRow = ({
  item,
  onClick,
}: {
  item: BoardListItem;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full flex-col gap-1 border-b border-border px-2 py-4 text-left transition-colors hover:bg-muted/40 last:border-b-0"
  >
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {item.category?.codeName && (
          <span className="text-xs text-muted-foreground">{item.category.codeName}</span>
        )}
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-foreground">
            {item.title}
          </span>
          {item.hasFile === "Y" && (
            <Icons.Paperclip className="size-3 shrink-0 text-muted-foreground/60" />
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/70">{item.createUser?.userName}</span>
          <span className="flex items-center gap-0.5">
            <Icons.MessageSquare className="size-3" />
            {item.commentCount ?? 0}
          </span>
        </div>
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">{fmtDate(item.createAt)}</span>
    </div>
  </button>
);

// ─── 게시판 섹션 ──────────────────────────────────────────────────────────────
const BoardSection = ({
  title,
  posts,
  onMore,
  showCategory,
  onPostClick,
}: {
  title: string;
  posts: BoardListItem[];
  onMore: () => void;
  showCategory?: boolean;
  onPostClick: (boardSeq: string) => void;
}) => {
  if (!posts.length) return null;
  const half = Math.ceil(posts.length / 2);
  const left = posts.slice(0, half);
  const right = posts.slice(half);

  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between border-b-2 border-foreground pb-2">
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
        <Button
          variant="ghost"
          size="h28"
          className="gap-0.5 text-xs text-muted-foreground hover:text-primary hover:bg-transparent"
          onClick={onMore}
        >
          더보기 <Icons.ChevronRight className="size-3.5" />
        </Button>
      </div>
      <div className="grid grid-cols-2 divide-x divide-border">
        <div className="space-y-0.5 pr-4">
          {left.map((item) => (
            <PostRow
              key={item.boardSeq}
              item={item}
              showCategory={showCategory}
              onClick={() => onPostClick(item.boardSeq)}
            />
          ))}
        </div>
        <div className="space-y-0.5 pl-4">
          {right.map((item) => (
            <PostRow
              key={item.boardSeq}
              item={item}
              showCategory={showCategory}
              onClick={() => onPostClick(item.boardSeq)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────
const BoardMainPage = () => {
  const navigate = useNavigate();

  const { data: mainRes, isLoading: mainLoading } = useQuery({
    queryKey: ["board", "main"],
    queryFn: () => boardApi(apiClient).getBoardMain(),
    staleTime: 30 * 1000,
  });
  const rawTree: BoardMainItem[] = mainRes?.data ?? [];
  const tree = rawTree.flatMap((item) => {
    if (item.boardType === "BOARD") return item.canRead === false ? [] : [item];
    const children = (item.children ?? []).filter((c) => c.canRead !== false);
    return children.length > 0 ? [{ ...item, children }] : [];
  });

  const { data: recentRes, isLoading: recentLoading } = useQuery({
    queryKey: ["board", "recent"],
    queryFn: () => boardApi(apiClient).getBoardList({ page: 1, pageSize: 8 }),
    staleTime: 30 * 1000,
  });
  const recentPosts = recentRes?.data?.list ?? [];
  const isLoading = mainLoading || recentLoading;

  const searchMut = useMutation({
    mutationFn: (payload: Parameters<ReturnType<typeof boardApi>["getBoardList"]>[0]) =>
      boardApi(apiClient).getBoardList(payload),
  });

  const [searchType, setSearchType] = useState("title");
  const [searchText, setSearchText] = useState("");
  const [appliedSearch, setAppliedSearch] = useState<{ type: string; keyword: string } | null>(null);
  const [searchResults, setSearchResults] = useState<BoardListItem[]>([]);
  const [searchTotal, setSearchTotal] = useState(0);

  const handleSearch = async () => {
    const keyword = searchText.trim();
    if (!keyword) {
      setAppliedSearch(null);
      return;
    }
    const applied = { type: searchType, keyword };
    setAppliedSearch(applied);
    const res = await searchMut.mutateAsync({
      page: 1,
      pageSize: 100,
      textFilters: [{ codeName: applied.type, codeValue: applied.keyword }],
    });
    setSearchResults(res.data?.list ?? []);
    setSearchTotal(res.data?.totalCount ?? 0);
  };

  const handleReset = () => {
    setSearchType("title");
    setSearchText("");
    setAppliedSearch(null);
    setSearchResults([]);
  };

  const handlePostClick = (boardSeq: string) => {
    navigate(`/board/view/${boardSeq}`);
  };

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <SettingsBar onSearch={handleSearch} onReset={handleReset}>
        <BarLabel>검색 구분</BarLabel>
        <SelectBox
          value={searchType}
          onChange={setSearchType}
          options={SEARCH_TYPES}
          className="w-24"
        />
        <BarSearch
          value={searchText}
          onChange={setSearchText}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="검색어 입력"
        />
      </SettingsBar>

      {/* 검색 결과 */}
      {appliedSearch && (
        <>
          <ListResultHeader totalCount={searchTotal} />

          {searchMut.isPending && (
            <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
              <Icons.Loader2 className="mr-2 size-4 animate-spin" />
              검색 중...
            </div>
          )}

          {!searchMut.isPending && searchResults.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Icons.FileText className="mb-2 size-8 opacity-30" />
              <p className="text-sm">검색 결과가 없습니다.</p>
            </div>
          )}

          {!searchMut.isPending && searchResults.length > 0 && (
            <div className="rounded-md border bg-card">
              {searchResults.map((item) => (
                <SearchResultRow
                  key={item.boardSeq}
                  item={item}
                  onClick={() => handlePostClick(item.boardSeq)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* 기본 대시보드 */}
      {!appliedSearch && (
        <>
          {isLoading && (
            <div className="flex items-center justify-center py-24 text-sm text-muted-foreground">
              <Icons.Loader2 className="mr-2 size-4 animate-spin" />
              로딩 중...
            </div>
          )}

          {!isLoading && (
            <>
              <BoardSection
                title="최신글"
                posts={recentPosts}
                onMore={() => navigate("/board/list")}
                showCategory
                onPostClick={handlePostClick}
              />

              {tree.map((item) => {
                if (item.boardType === "BOARD") {
                  return (
                    <BoardSection
                      key={item.configSeq}
                      title={item.boardName}
                      posts={item.recentPosts ?? []}
                      onMore={() => navigate(`/board/list?configSeq=${item.configSeq}&boardName=${encodeURIComponent(item.boardName)}`)}
                      onPostClick={handlePostClick}
                    />
                  );
                }
                // CATEGORY: 자식 게시판들을 렌더링
                return (
                  <Fragment key={item.configSeq}>
                    {(item.children ?? []).map((child) => (
                      <BoardSection
                        key={child.configSeq}
                        title={child.boardName}
                        posts={child.recentPosts ?? []}
                        onMore={() => navigate(`/board/list?configSeq=${child.configSeq}&boardName=${encodeURIComponent(child.boardName)}`)}
                        onPostClick={handlePostClick}
                      />
                    ))}
                  </Fragment>
                );
              })}

              {tree.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                  <Icons.FileText className="mb-3 size-10 opacity-30" />
                  <p className="text-sm">게시글이 없습니다.</p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </main>
  );
};

export default BoardMainPage;
