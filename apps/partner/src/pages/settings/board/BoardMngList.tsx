import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, DndProvider, DragHandle, FlexBox, Icons, SortableItem, SortableList } from "@repo/ui";
import PageTitleArea from "@shared/ui/PageTitleArea.tsx";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import ListResultHeader from "@shared/ui/ListResultHeader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { boardConfigQueries } from "@shared/query/board/boardConfigQueries.ts";
import type { BoardConfig } from "@shared/api/board/boardConfigApi.ts";
import type { BoardListResponse } from "@shared/api/board/boardApi.ts";
import type { ApiResponse } from "@shared/commonType.ts";
import { useAlertStore } from "@shared/store/useAlertStore";
import { CategoryConfigModal } from "./modal/CategoryConfigModal";
import { BoardConfigModal } from "./modal/BoardConfigModal";

const UNIT_PINK = "[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5 inset-shadow-none";

type FlatItem = BoardConfig & { id: string };

// 트리 → 플랫 배열 (카테고리 바로 다음에 자식들이 오도록)
const toFlat = (tree: BoardConfig[]): FlatItem[] => {
  const result: FlatItem[] = [];
  tree.forEach((parent) => {
    result.push({ ...parent, id: parent.configSeq! });
    parent.children?.forEach((child) => result.push({ ...child, id: child.configSeq! }));
  });
  return result;
};

// 드롭 후 위치 기반으로 새 parentSeq 결정
const resolveParentSeq = (items: FlatItem[], movedId: string): string | null => {
  const idx = items.findIndex((item) => item.id === movedId);
  const movedItem = items[idx];

  // 카테고리는 항상 최상위
  if (movedItem.boardType === "CATEGORY") return null;

  const prev = idx > 0 ? items[idx - 1] : null;
  if (!prev) return null;
  if (prev.boardType === "CATEGORY") return prev.configSeq!;
  return prev.parentSeq ?? null;
};

// 드래그된 아이템 ID 찾기 — "가장 많이 이동한 아이템" 기준
// 동거리(인접 스왑)일 때는 parentSeq가 바뀌는 쪽을 우선 선택
const findMovedId = (before: FlatItem[], after: FlatItem[]): string | undefined => {
  let maxShift = 0;
  let candidates: string[] = [];

  for (const item of after) {
    const from = before.findIndex((b) => b.id === item.id);
    const to = after.findIndex((a) => a.id === item.id);
    const shift = Math.abs(to - from);
    if (shift > maxShift) {
      maxShift = shift;
      candidates = [item.id];
    } else if (shift === maxShift && shift > 0) {
      candidates.push(item.id);
    }
  }

  if (candidates.length === 0) return undefined;
  if (candidates.length === 1) return candidates[0];

  // 동거리(인접 스왑): parentSeq가 바뀌는 아이템 우선
  for (const id of candidates) {
    const original = before.find((b) => b.id === id)!;
    const newParent = resolveParentSeq(after, id);
    if (newParent !== (original.parentSeq ?? null)) return id;
  }

  return candidates[0];
};

// 이동된 아이템의 parentSeq를 위치 기반으로 갱신
const applyParentSeq = (before: FlatItem[], after: FlatItem[]): FlatItem[] => {
  const movedId = findMovedId(before, after);
  if (!movedId) return after;

  const movedItem = after.find((item) => item.id === movedId)!;

  // 카테고리가 자식 아이템들 사이로 이동하는 것은 차단
  if (movedItem.boardType === "CATEGORY") {
    const movedIdx = after.findIndex((item) => item.id === movedId);
    const prevItem = movedIdx > 0 ? after[movedIdx - 1] : null;
    if (prevItem?.parentSeq) return before;
  }

  const newParentSeq = resolveParentSeq(after, movedId);
  return after.map((item) =>
    item.id === movedId ? { ...item, parentSeq: newParentSeq } : item
  );
};

export const BoardMngList = () => (
  <>
    <PageTitleArea className="pb-2" title="게시판 관리" />
    <BoardTreeManager />
  </>
);

// ─── 드래그 순서 변경 + 레벨 간 이동 ────────────────────────

const BoardTreeManager = () => {
  const queryClient = useQueryClient();
  const { openAlert } = useAlertStore();
  const { data: treeRes, isLoading } = useQuery(boardConfigQueries.getList({ pageSize: 200 }));
  const treeData: BoardConfig[] = treeRes?.data?.list || [];

  const deleteMutation = useMutation(boardConfigQueries.deleteConfig());
  const orderMutation = useMutation(boardConfigQueries.updateOrder());

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isBoardOpen, setIsBoardOpen] = useState(false);
  const [editingData, setEditingData] = useState<BoardConfig | null>(null);

  const [flatItems, setFlatItems] = useState<FlatItem[]>([]);

  useEffect(() => {
    setFlatItems(toFlat(treeData));
  }, [treeData]);

  const isDirty = useMemo(() => {
    const original = toFlat(treeData);
    if (flatItems.length !== original.length) return true;
    return flatItems.some((item, idx) => item.id !== original[idx].id || item.parentSeq !== original[idx].parentSeq);
  }, [flatItems, treeData]);

  // SortableList.onChange: 드래그 중 라이브 미리보기 + parentSeq 갱신
  const onFlatChange = useCallback((next: FlatItem[]) => {
    setFlatItems((prev) => applyParentSeq(prev, next));
  }, []);

  // DndProvider.setData: 드롭 확정 시 parentSeq 갱신
  const setFlatData = useCallback((updater: (prev: FlatItem[]) => FlatItem[]) => {
    setFlatItems((prev) => {
      const reordered = updater(prev);
      return applyParentSeq(prev, reordered);
    });
  }, []);

  const handleSaveOrder = () => {
    // dispOrd는 같은 부모 내에서 1부터 시작
    const groupCounters: Record<string, number> = {};
    const orders = flatItems.map((item) => {
      const key = item.parentSeq ?? "__root__";
      groupCounters[key] = (groupCounters[key] || 0) + 1;
      return {
        configSeq: item.configSeq!,
        dispOrd: groupCounters[key],
        parentSeq: item.parentSeq ?? null,
      };
    });

    orderMutation.mutate(orders, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["boardConfig"] });
        openAlert({ message: "순서가 저장되었습니다.", confirmText: "확인", showCancel: false });
      },
      onError: () =>
        openAlert({ message: "순서 저장에 실패했습니다.", confirmText: "확인", showCancel: false }),
    });
  };

  const handleDelete = (item: BoardConfig) => {
    if (isDirty) {
      openAlert({
        message: "순서 변경 내용을 먼저 저장해 주세요.",
        confirmText: "확인",
        showCancel: false,
      });
      return;
    }

    const hasChildren = flatItems.some((f) => f.parentSeq === item.configSeq);
    if (hasChildren) {
      openAlert({
        message: "하위 게시판이 있어 삭제할 수 없습니다.",
        confirmText: "확인",
        showCancel: false,
      });
      return;
    }

    openAlert({
      message: `[${item.boardName}] 게시판/폴더를 삭제하시겠습니까?`,
      type: "confirm",
      onConfirm: () => {
        deleteMutation.mutate(item.configSeq!, {
          onSuccess: () => {
            openAlert({ message: "삭제되었습니다.", confirmText: "확인", showCancel: false });
            queryClient.invalidateQueries({ queryKey: ["boardConfig"] });
            queryClient.invalidateQueries({ queryKey: ["board", "main"] });
            const filterDeleted = (old: ApiResponse<BoardListResponse> | undefined) => {
              if (!old?.data?.list) return old;
              const list = old.data.list.filter((p) => p.category?.code !== item.configSeq);
              return { ...old, data: { ...old.data, list, totalCount: list.length } };
            };
            queryClient.setQueriesData({ queryKey: ["board", "recent"] }, filterDeleted);
            queryClient.setQueriesData({ queryKey: ["board", "list"] }, filterDeleted);
            queryClient.invalidateQueries({ queryKey: ["board", "recent"] });
            queryClient.invalidateQueries({ queryKey: ["board", "list"] });
          },
          onError: () =>
            openAlert({ message: "삭제에 실패했습니다.", confirmText: "확인", showCancel: false }),
        });
      },
    });
  };

  const handleEdit = (item: BoardConfig) => {
    setEditingData(item);
    if (item.boardType === "CATEGORY") setIsCategoryOpen(true);
    else setIsBoardOpen(true);
  };

  return (
    <FormUnitBox title="게시판 목록" className={UNIT_PINK} vertical>
      <ListResultHeader totalCount={flatItems.length}>
        <FlexBox className="gap-1">
          {isDirty && (
            <Button
              size="h28"
              variant="blue"
              onClick={handleSaveOrder}
              disabled={orderMutation.isPending}
            >
              <Icons.Save className="size-3.5" />
              {orderMutation.isPending ? "저장 중..." : "순서 저장"}
            </Button>
          )}
          <Button
            size="h28"
            variant="outline"
            onClick={() => { setEditingData(null); setIsCategoryOpen(true); }}
          >
            <Icons.FolderPlus className="size-3.5" />
            폴더 추가
          </Button>
          <Button
            size="h28"
            variant="outline-pink"
            onClick={() => { setEditingData(null); setIsBoardOpen(true); }}
          >
            <Icons.Plus className="size-3.5" />
            게시판 추가
          </Button>
        </FlexBox>
      </ListResultHeader>

      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground text-sm">로딩 중...</div>
      ) : (
        <div className="rounded-md border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="w-8 p-2" />
                <th className="p-3 text-left font-medium">게시판명</th>
                <th className="p-3 text-left font-medium w-36">게시판 타입</th>
                <th className="p-3 text-center font-medium w-28">도구</th>
              </tr>
            </thead>
            <tbody>
              <DndProvider setData={setFlatData}>
                <SortableList
                  items={flatItems}
                  getId={(item) => item.id}
                  onChange={onFlatChange}
                  renderItem={(item, { id }) => (
                    <SortableItem key={id} id={id}>
                      {({ setNodeRef, attributes, listeners, style, isDragging }) => (
                        <tr
                          ref={setNodeRef}
                          style={style}
                          className={`border-b border-border/50 transition-colors ${
                            isDragging ? "bg-blue-500/10 opacity-70" : "hover:bg-muted/30"
                          }`}
                        >
                          <td className="p-1 text-center">
                            <DragHandle listeners={listeners} attributes={attributes} className="w-auto">
                              <Icons.GripVertical className="size-4" />
                            </DragHandle>
                          </td>
                          <td className="p-3">
                            <div
                              className="flex items-center gap-2"
                              style={{ paddingLeft: item.parentSeq ? "20px" : "0px" }}
                            >
                              {item.boardType === "CATEGORY" ? (
                                <Icons.Folder className="size-4 text-amber-500" />
                              ) : (
                                <Icons.FileText className="size-4 text-muted-foreground" />
                              )}
                              <span className={item.boardType === "CATEGORY" ? "font-semibold" : ""}>
                                {item.boardName}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-muted-foreground text-xs">
                            {item.boardType === "CATEGORY" ? "폴더" : item.boardType}
                          </td>
                          <td className="p-3">
                            <FlexBox className="gap-1 justify-center">
                              {item.boardType === "CATEGORY" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-7 text-p-color-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingData({ parentSeq: item.configSeq });
                                    setIsBoardOpen(true);
                                  }}
                                >
                                  <Icons.Plus className="size-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7 text-muted-foreground hover:text-foreground"
                                onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                              >
                                <Icons.Pencil className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7 text-destructive"
                                onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                              >
                                <Icons.Trash2 className="size-4" />
                              </Button>
                            </FlexBox>
                          </td>
                        </tr>
                      )}
                    </SortableItem>
                  )}
                />
              </DndProvider>

              {flatItems.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    등록된 게시판이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <CategoryConfigModal
        open={isCategoryOpen}
        onOpenChange={(open) => { setIsCategoryOpen(open); if (!open) setEditingData(null); }}
        data={editingData}
        existingItems={flatItems}
      />
      <BoardConfigModal
        open={isBoardOpen}
        onOpenChange={(open) => { setIsBoardOpen(open); if (!open) setEditingData(null); }}
        data={editingData}
        existingItems={flatItems}
      />
    </FormUnitBox>
  );
};

export default BoardMngList;
