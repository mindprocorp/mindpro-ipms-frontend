import { Icons } from "@repo/ui";
import PageTitleArea from "@shared/ui/PageTitleArea.tsx";
import ListResultHeader from "@shared/ui/ListResultHeader";
import { useEffect, useState, useMemo, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams, useOutletContext } from "react-router-dom";
import { boardQueries } from "@shared/query/board/boardQueries.ts";
import { orgQueries } from "@shared/query/organization/queries";
import { CODE_CLASS } from "@shared/enum/organizationType";
import type { OfficeCodeVO } from "@shared/api/organization/orgApi";
import { useAuthStore } from "@shared/store/useUserInfoStore";
import { SettingsBar, BarSearch, BarLabel } from "@pages/settings/_components/common/SettingsBar";
import SelectBox from "@pages/settings/_components/common/SelectBox";
import type { BoardConfig } from "@shared/api/board/boardConfigApi";

const findBoardDesc = (nodes: BoardConfig[], seq: string): string => {
  for (const n of nodes) {
    if (n.configSeq === seq) return n.description ?? "";
    if (n.children) {
      const found = findBoardDesc(n.children, seq);
      if (found) return found;
    }
  }
  return "";
};
const FILTER_MAP: Record<string, { title: string; condition: (userMstSeq?: string) => Array<Record<string, string>> }> = {
  mine:     { title: "내 게시글", condition: (seq) => seq ? [{ codeName: "createUser", codeValue: seq }] : [] },
};

const SEARCH_TYPES = [
  { value: "title",          label: "제목" },
  { value: "content",        label: "내용" },
  { value: "createUserName", label: "작성자" },
];

const fmtDate = (d: string) =>
  d ? `${d.slice(0, 4)}. ${d.slice(5, 7)}. ${d.slice(8, 10)}.` : "";

const isActivePinned = (item: { isPinned: string; pinnedEndAt?: string }) => {
  if (item.isPinned !== "Y") return false;
  if (!item.pinnedEndAt) return true;
  const raw = item.pinnedEndAt;
  // 서버는 YYYYMMDD 형식으로 반환 (대시 없음)
  const normalized = raw.length === 8
    ? `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
    : raw.slice(0, 10);
  return normalized >= new Date().toISOString().slice(0, 10);
};

// ─── 행 컴포넌트 ─────────────────────────────────────────────────────────────
const PostRow = ({
  item,
  showCategory,
  onClick,
}: {
  item: any;
  showCategory: boolean;
  onClick: () => void;
}) => {
  const tags = item.tags ?? [];

  const pinned = isActivePinned(item);

  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-start gap-3 border-b border-border px-4 py-3.5 transition-colors hover:bg-muted/40 last:border-b-0"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* 제목 행 */}
        <div className="flex items-center gap-1.5">
          {pinned && (
            <Icons.Pin className="size-3 shrink-0 text-red-500" />
          )}
          {item.postStatus === "DRAFT" && (
            <span className="shrink-0 rounded-sm bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-500">
              작성중
            </span>
          )}
          {tags.length > 0 && (
            <span className="shrink-0 text-sm text-muted-foreground">
              [{tags.join(", ")}]
            </span>
          )}
          <span className={`truncate text-sm font-medium ${pinned ? "text-red-700" : "text-foreground"}`}>
            {item.title}
          </span>
          {item.hasFile === "Y" && (
            <Icons.Paperclip className="size-3 shrink-0 text-muted-foreground" />
          )}
        </div>

        {/* 메타 행 */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {showCategory && item.category?.codeName && (
            <>
              <span>{item.category.codeName}</span>
              <span>·</span>
            </>
          )}
          <span>{item.createUser?.userName ?? "-"}</span>
          {(item.viewCount ?? 0) > 0 && (
            <span className="flex items-center gap-0.5">
              <Icons.Eye className="size-3" />
              읽음 {item.viewCount}
            </span>
          )}
          {(item.commentCount ?? 0) > 0 && (
            <span className="flex items-center gap-0.5">
              <Icons.MessageSquare className="size-3" />
              {item.commentCount}
            </span>
          )}
        </div>
      </div>

      <span className="mt-0.5 shrink-0 text-xs text-muted-foreground">
        {fmtDate(item.createAt)}
      </span>
    </div>
  );
};

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────
const BoardList = () => {
  const navigate = useNavigate();
  const getCategoryList = useMutation(orgQueries.getOfficeCodeList());
  const user = useAuthStore((s) => s.user);

  const [categories, setCategories] = useState<OfficeCodeVO[]>([]);
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("category") || "";
  const activeFilter = searchParams.get("filter") || "";
  const activeConfigSeq = searchParams.get("configSeq") || "";
  const activeBoardName = searchParams.get("boardName") || "";

  const [searchType, setSearchType] = useState(() => searchParams.get("searchType") || "title");
  const [searchText, setSearchText] = useState(() => searchParams.get("searchKeyword") || "");
  const [appliedSearch, setAppliedSearch] = useState<{ type: string; keyword: string } | null>(() => {
    const type = searchParams.get("searchType") || "title";
    const keyword = searchParams.get("searchKeyword") || "";
    return keyword ? { type, keyword } : null;
  });
  const prevParamsKey = useRef("");

  const outletContext = useOutletContext<{ treeData?: BoardConfig[] }>();
  const treeData = outletContext?.treeData ?? [];
  const activeBoardDesc = activeConfigSeq ? findBoardDesc(treeData, activeConfigSeq) : "";

  useEffect(() => {
    getCategoryList.mutateAsync({ codeClass: CODE_CLASS.BOARD_CATEGORY }).then(setCategories).catch(() => {});
  }, []);

  // 게시판/카테고리가 바뀌면 검색 초기화
  useEffect(() => {
    const key = `${activeTab}|${activeFilter}|${activeConfigSeq}`;
    if (prevParamsKey.current && prevParamsKey.current !== key) {
      setSearchText("");
      setAppliedSearch(null);
    }
    prevParamsKey.current = key;
  }, [activeTab, activeFilter, activeConfigSeq]);

  const handleSearch = () => {
    const keyword = searchText.trim();
    setAppliedSearch(keyword ? { type: searchType, keyword } : null);
  };

  const handleReset = () => {
    setSearchType("title");
    setSearchText("");
    setAppliedSearch(null);
  };

  // 검색 조건 계산
  const searchPayload = useMemo(() => {
    const isMine = activeFilter === "mine";
    const searchCondition = activeConfigSeq
      ? [{ codeName: "categoryCode", codeValue: activeConfigSeq }]
      : activeTab
        ? [{ codeName: "categoryCode", codeValue: activeTab }]
        : isMine && user?.userInfoSeq
          ? [{ codeName: "createUser", codeValue: user.userInfoSeq }]
          : activeFilter && FILTER_MAP[activeFilter]
            ? FILTER_MAP[activeFilter].condition(user?.userMstSeq)
            : undefined;

    const textFilters = appliedSearch
      ? [{ codeName: appliedSearch.type, codeValue: appliedSearch.keyword }]
      : undefined;

    return {
      page: 1,
      pageSize: 100,
      userInfoSeq: isMine ? (user?.userInfoSeq ?? undefined) : undefined,
      searchCondition,
      textFilters,
    };
  }, [activeTab, activeFilter, activeConfigSeq, user, appliedSearch]);

  // useQuery로 데이터 페칭 (중복 요청 자동 방지)
  const { data: boardRes, isPending } = useQuery(boardQueries.getBoardListQuery(searchPayload));
  const rawList = boardRes?.data?.list ?? [];
  const listData = [...rawList].sort((a, b) => {
    const aPin = isActivePinned(a) ? 1 : 0;
    const bPin = isActivePinned(b) ? 1 : 0;
    return bPin - aPin;
  });
  const totalCount = boardRes?.data?.totalCount ?? 0;

  const pageTitle = activeBoardName
    ? decodeURIComponent(activeBoardName)
    : activeFilter
      ? (FILTER_MAP[activeFilter]?.title ?? "최신글")
      : (categories.find((c) => c.officeCode === activeTab)?.codeName ?? "최신글");

  const showCategory = !activeConfigSeq && !activeTab;

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-4 p-6">
      <PageTitleArea className="flex-none" title={pageTitle} desc={activeBoardDesc} />

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

      <ListResultHeader totalCount={totalCount} />

      <div className="flex flex-1 flex-col rounded-md border bg-card overflow-hidden">

        {/* 로딩 */}
        {isPending && (
          <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
            <Icons.Loader2 className="mr-2 size-4 animate-spin" />
            불러오는 중...
          </div>
        )}

        {/* 빈 상태 */}
        {!isPending && listData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Icons.FileText className="mb-2 size-8 opacity-30" />
            <p className="text-sm">{appliedSearch ? "검색 결과가 없습니다." : "게시글이 없습니다."}</p>
          </div>
        )}

        {/* 목록 */}
        {!isPending &&
          listData.map((item: any) => (
            <PostRow
              key={item.boardSeq}
              item={item}
              showCategory={showCategory}
              onClick={() => navigate(`/board/view/${item.boardSeq}`)}
            />
          ))}
      </div>
    </main>
  );
};

export default BoardList;
