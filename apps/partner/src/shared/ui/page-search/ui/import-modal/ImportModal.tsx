import type { ModalProps } from "@repo/schema";
import { FlexBox, FormDialog, Icons } from "@repo/ui";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { commonQueries } from "@shared/query/common/queries";
import type { SearchConditionItem, CodeSelectOption } from "@shared/api/common/commApi";
import { useAlertStore } from "@shared/store/useAlertStore";
import type { SearchParm } from "../../types";
import type { CodeItemSets } from "../../model/useSearchCodeItems";
import ConditionPanel, { type ConditionPanelItem } from "../ConditionPanel";

interface ImportModalProps extends ModalProps {
  menuCode?: string;
  onLoad?: (parms: SearchParm[]) => void;
  codeItems?: CodeItemSets;
  subCodeMap?: Record<string, CodeSelectOption[]>;
  baseRefMap?: Record<string, string>;
  loadSubCode?: (cateCode: string, grpCd: string) => void;
}

const resolveLabel = (
  cate: string,
  type: "default" | "date" | "string",
  codeItems?: CodeItemSets
): string => {
  if (!codeItems) return cate;
  const pool = type === "date" ? codeItems.date : type === "string" ? codeItems.str : codeItems.base;
  return pool.find((c) => c.value === cate)?.label ?? cate;
};

const resolveValue = (
  cate: string,
  value: string,
  type: "default" | "date" | "string",
  subCodeMap?: Record<string, CodeSelectOption[]>
): string => {
  if (type === "default" && value && subCodeMap?.[cate]) {
    return subCodeMap[cate].find((c) => c.value === value)?.label ?? value;
  }
  return value;
};

const toCondition = (andOrNOT?: string): "and" | "exclusion" =>
  andOrNOT === "NOT" ? "exclusion" : "and";

const detailToConditionItems = (
  detail: SearchConditionItem,
  codeItems?: CodeItemSets,
  subCodeMap?: Record<string, CodeSelectOption[]>
): ConditionPanelItem[] => [
  ...Object.entries(detail.searchOptions ?? {}).map(([key, value]) => {
    const label = resolveLabel(key, "default", codeItems);
    const val = resolveValue(key, String(value), "default", subCodeMap);
    return { id: key, label: val ? `${label}: ${val}` : label, condition: "and" as const };
  }),
  ...(detail.dateFilters ?? []).map((f) => ({
    id: f.type,
    label: `${resolveLabel(f.type, "date", codeItems)}: ${f.startDate ?? ""} ~ ${f.endDate ?? ""}`,
    condition: toCondition(f.andOrNOT),
  })),
  ...(detail.textFilters ?? []).map((f) => ({
    id: f.type,
    label: f.value
      ? `${resolveLabel(f.type, "string", codeItems)}: ${f.value}`
      : resolveLabel(f.type, "string", codeItems),
    condition: toCondition(f.andOrNOT),
  })),
];

const ImportModal = ({ open, onOpenChange, menuCode, onLoad, codeItems, subCodeMap, baseRefMap, loadSubCode }: ImportModalProps) => {
  const [list, setList] = useState<SearchConditionItem[]>([]);
  const [selectedSeq, setSelectedSeq] = useState<string | null>(null);
  const [previewDetail, setPreviewDetail] = useState<SearchConditionItem | null>(null);
  const { openAlert } = useAlertStore();

  const { mutate: fetchList, isPending: isLoadingList } = useMutation(commonQueries.getSearchList());
  const { mutate: fetchDetail, isPending: isLoadingDetail } = useMutation(commonQueries.getSearchDetail());
  const { mutate: deleteCondition } = useMutation(commonQueries.deleteSearchCondition());

  const refreshList = (code: string) => {
    fetchList(code, {
      onSuccess: (res) => {
        const payload = (res as any)?.data ?? res; // eslint-disable-line @typescript-eslint/no-explicit-any
        setList(payload?.list ?? (Array.isArray(payload) ? payload : []));
      },
      onError: () => setList([]),
    });
  };

  useEffect(() => {
    if (!open || !menuCode) return;
    setSelectedSeq(null);
    setPreviewDetail(null);
    refreshList(menuCode);
  }, [open, menuCode]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = (conditionSeq: string) => {
    setSelectedSeq(conditionSeq);
    fetchDetail(conditionSeq, {
      onSuccess: (res) => {
        const detail: SearchConditionItem = (res as { data: SearchConditionItem })?.data;
        setPreviewDetail(detail ?? null);
        // 기본 검색 옵션의 하위코드 온디맨드 로드 (미리보기 레이블 해석용)
        if (detail?.searchOptions && loadSubCode && baseRefMap) {
          Object.keys(detail.searchOptions).forEach((key) => {
            const grpCd = baseRefMap[key];
            if (grpCd) loadSubCode(key, grpCd);
          });
        }
      },
      onError: () => setPreviewDetail(null),
    });
  };

  const handleLoad = () => {
    if (!previewDetail) return;

    const parms: SearchParm[] = [
      ...Object.entries(previewDetail.searchOptions ?? {}).map(([key, value]) => ({
        label: key, value: String(value), id: crypto.randomUUID(),
        cateCode: key, valueCode: String(value),
        type: "default" as const, condition: "and" as const,
      })),
      ...(previewDetail.dateFilters ?? []).map((f) => ({
        label: f.type,
        value: `${f.startDate ?? ""} ~ ${f.endDate ?? ""}`,
        id: crypto.randomUUID(), cateCode: f.type,
        type: "date" as const, condition: toCondition(f.andOrNOT),
        fromValue: f.startDate, toValue: f.endDate,
      })),
      ...(previewDetail.textFilters ?? []).map((f) => ({
        label: f.type, value: f.value, id: crypto.randomUUID(),
        cateCode: f.type, valueCode: f.value,
        type: "string" as const, condition: toCondition(f.andOrNOT),
      })),
    ];

    onLoad?.(parms);
    onOpenChange(false);
  };

  const handleDelete = (e: React.MouseEvent, conditionSeq: string) => {
    e.stopPropagation();
    openAlert({
      message: "삭제하시겠습니까?",
      type: "confirm",
      onConfirm: () =>
        deleteCondition(conditionSeq, {
          onSuccess: () => {
            if (selectedSeq === conditionSeq) {
              setSelectedSeq(null);
              setPreviewDetail(null);
            }
            menuCode && refreshList(menuCode);
          },
          onError: () => openAlert({ message: "삭제에 실패했습니다." }),
        }),
    });
  };

  const renderList = () => {
    if (!menuCode) {
      return (
        <p className="py-10 text-center text-sm text-muted-foreground">
          이 페이지는 검색조건 저장을 지원하지 않습니다.
        </p>
      );
    }
    if (isLoadingList) {
      return <p className="py-10 text-center text-sm text-muted-foreground">로딩 중...</p>;
    }
    if (list.length === 0) {
      return (
        <p className="py-10 text-center text-sm text-muted-foreground">저장된 검색 조건이 없습니다.</p>
      );
    }
    return (
      <div className="flex w-full flex-col gap-1.5">
        {list.map((item) => (
          <div
            key={item.conditionSeq}
            role="button"
            tabIndex={0}
            onClick={() => handleSelect(item.conditionSeq)}
            onKeyDown={(e) => e.key === "Enter" && handleSelect(item.conditionSeq)}
            className={[
              "flex w-full cursor-pointer select-none items-center justify-between rounded-md border px-4 py-2.5 text-sm outline-none transition-colors",
              selectedSeq === item.conditionSeq
                ? "border-p-color-1 bg-p-color-1/10 font-medium"
                : "hover:bg-muted/50",
            ].join(" ")}
          >
            <span className="truncate pr-2">{item.conditionName}</span>
            <div className="flex flex-none items-center gap-2">
              <span className="text-xs text-muted-foreground">{item.createAt}</span>
              <button
                type="button"
                onClick={(e) => handleDelete(e, item.conditionSeq)}
                className="text-muted-foreground transition-colors hover:text-destructive"
              >
                <Icons.Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const previewItems = previewDetail
    ? detailToConditionItems(previewDetail, codeItems, subCodeMap)
    : [];

  return (
    <FormDialog
      title="검색조건 불러오기"
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleLoad}
      submitText="불러오기"
      submitDisabled={!previewDetail}
      submitLoading={isLoadingDetail}
      className="sm:max-w-[700px]"
    >
      <div className="flex gap-0 overflow-hidden rounded-md border">
        <div className="min-h-[200px] flex-1 p-4">{renderList()}</div>
        <div className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 w-60 flex-none border-l">
          <ConditionPanel
            items={previewItems}
            emptyText="조건을 선택하면 미리보기가 표시됩니다."
          />
        </div>
      </div>
    </FormDialog>
  );
};

export default ImportModal;
