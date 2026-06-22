import { useState, useMemo } from "react";
import { AvatarWrap, Button, FlexBox, Icons, Input } from "@repo/ui";

import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";

export interface ListPanelItem {
  id: string;
  title: string;
  subtitle?: string;
  extra?: string;
  image?: string;
}

interface SettingsListPanelProps {
  /** FormUnitBox 타이틀 */
  label: string;
  /** 현재 선택된 필터 라벨 (카테고리명, 부서명 등) */
  filterLabel?: string;
  /** 필터 버튼 커스텀 (breadcrumb 등) */
  filterButtons?: React.ReactNode;
  /** 전체 아이템 */
  items: ListPanelItem[];
  /** 검색 placeholder */
  searchPlaceholder?: string;
  /** 빈 상태 메시지 */
  emptyMessage?: string;
  /** 필터 해제 콜백 */
  onShowAll?: () => void;
  /** 외부에서 showAll 제어 */
  showAll?: boolean;
  /** 이미지 표시 여부 */
  showImage?: boolean;
  /** 기본 이미지 */
  defaultImage?: string;
  /** 아이템 클릭 콜백 */
  onItemClick?: (item: ListPanelItem) => void;
}

const SettingsListPanel = ({
  label,
  filterLabel,
  filterButtons,
  items,
  searchPlaceholder = "검색",
  emptyMessage = "등록된 항목이 없습니다.",
  onShowAll,
  showAll = true,
  showImage = false,
  defaultImage,
  onItemClick,
}: SettingsListPanelProps) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const kw = search.trim().toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(kw) ||
        item.subtitle?.toLowerCase().includes(kw) ||
        item.extra?.toLowerCase().includes(kw),
    );
  }, [items, search]);

  const titlePrefix = showAll ? `전체 ${label}` : filterLabel ? `${filterLabel} ${label}` : label;
  const title = `${titlePrefix} · 총 ${filtered.length}건`;

  return (
    <FormUnitBox title={title} className="inset-shadow-none flex-1" vertical>
      <FlexBox className="justify-between pb-2">
        <FlexBox className="gap-1">
          <Button
            size="h28"
            variant={showAll ? "blue" : "outline"}
            onClick={() => { onShowAll?.(); setSearch(""); }}
          >
            전체
          </Button>
          {filterButtons}
          {!filterButtons && filterLabel && !showAll && (
            <Button size="h28" variant="blue">
              {filterLabel}
            </Button>
          )}
        </FlexBox>
        <div className="relative">
          <Icons.Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
          <Input
            className="w-48 bg-white pl-8"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </FlexBox>
      <div className="h-[calc(100vh-265px)] overflow-auto">
        {filtered.length > 0 ? (
          filtered.map((item, idx) => (
            <div
              key={item.id}
              className={`border-border-200/50 flex items-center gap-2 border-b px-2 py-3 ${onItemClick ? "cursor-pointer hover:bg-gray-50" : ""}`}
              onClick={() => onItemClick?.(item)}
            >
              <span className="text-muted-foreground w-6 shrink-0 text-center text-xs">{idx + 1}</span>
              {showImage && (
                <div className="shrink-0 [&_span]:size-9 [&_img]:size-9">
                  <AvatarWrap img={item.image || defaultImage} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{item.title}</p>
                {item.subtitle && <p className="text-text-200 truncate text-xs">{item.subtitle}</p>}
              </div>
              {item.extra && <p className="text-text-200 shrink-0 text-xs">{item.extra}</p>}
            </div>
          ))
        ) : (
          <p className="text-muted-foreground py-8 text-center text-xs">{emptyMessage}</p>
        )}
      </div>
    </FormUnitBox>
  );
};

export default SettingsListPanel;
