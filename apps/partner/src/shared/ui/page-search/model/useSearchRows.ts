import { useCallback, useEffect, useRef } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { today } from "@repo/ui";
import { useAlertStore } from "@shared/store/useAlertStore";
import type { SearchItem, SearchSettingInput } from "../schema";

export type SearchRowType = "default" | "date" | "string";

const FIELD_NAME = {
  default: "defaultSearch",
  date: "dateSearch",
  string: "stringSearch",
} as const satisfies Record<SearchRowType, keyof SearchSettingInput>;

export type SearchFieldName = (typeof FIELD_NAME)[SearchRowType];

export const makeEmptyRow = (type: SearchRowType): SearchItem => ({
  itemId: crypto.randomUUID(),
  cate: "",
  value: "",
  fromValue: today(),
  toValue: today(),
  condition: "and",
  type,
});

interface UseSearchRowsOptions {
  type: SearchRowType;
  /** true이면 cate + value 둘 다 필요 (default, string). false이면 cate만 필요 (date). */
  requireValue?: boolean;
  focusedItemId: string | null;
  setFocusedItemId: (id: string | null) => void;
  /** cate 변경 시 추가 처리가 필요한 경우 (e.g. 하위코드 로드) */
  onCateChange?: (params: { cate: string; prevCate: string; index: number }) => void;
}

export function useSearchRows({
  type,
  requireValue = false,
  focusedItemId,
  setFocusedItemId,
  onCateChange,
}: UseSearchRowsOptions) {
  const fieldName = FIELD_NAME[type];
  const { control, setValue, getValues } = useFormContext<SearchSettingInput>();
  const { fields, append, remove } = useFieldArray({ name: fieldName, control });
  const openAlert = useAlertStore((s) => s.openAlert);

  const prevCateRef = useRef<Record<string, string>>({});

  const watched = useWatch({ control, name: fieldName }) as Partial<SearchItem>[];

  // cate 변경 감지: 중복 체크 + value 초기화 + onCateChange 콜백
  useEffect(() => {
    if (!watched?.length) return;
    watched.forEach((field, i) => {
      const { itemId, cate = "" } = field ?? {};
      if (!itemId) return;

      const prev = prevCateRef.current[itemId];
      if (prev !== undefined && prev !== cate) {
        setValue(`${fieldName}.${i}.value` as any, ""); // eslint-disable-line @typescript-eslint/no-explicit-any

        if (cate && cate !== "none") {
          const selected = (getValues("searchSelected") ?? []) as Partial<SearchItem>[];
          if (selected.some((s) => s.type === type && s.cate === cate && s.itemId !== itemId)) {
            openAlert({ message: "이미 선택된 조건입니다." });
            setValue(`${fieldName}.${i}.cate` as any, prev); // eslint-disable-line @typescript-eslint/no-explicit-any
            setValue(`${fieldName}.${i}.value` as any, ""); // eslint-disable-line @typescript-eslint/no-explicit-any
            prevCateRef.current[itemId] = prev;
            return;
          }
          onCateChange?.({ cate, prevCate: prev, index: i });
        }
      }
      prevCateRef.current[itemId] = cate;
    });
  }, [watched]); // eslint-disable-line react-hooks/exhaustive-deps

  // 좌측 수정 내용을 searchSelected에 실시간 반영
  useEffect(() => {
    if (!watched?.length) return;
    const selected = (getValues("searchSelected") ?? []) as Partial<SearchItem>[];
    if (selected.length === 0) return;

    let dirty = false;
    const next = selected.map((sel) => {
      const match = watched.find((f) => f.itemId === sel.itemId);
      if (match && JSON.stringify(match) !== JSON.stringify(sel)) {
        dirty = true;
        return { ...match };
      }
      return sel;
    });
    if (dirty) setValue("searchSelected", next as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  }, [watched]); // eslint-disable-line react-hooks/exhaustive-deps

  const addItem = useCallback(() => {
    const rows = (getValues(fieldName) ?? []) as Partial<SearchItem>[];
    const selected = (getValues("searchSelected") ?? []) as Partial<SearchItem>[];
    const selectedIds = new Set(selected.map((s) => s.itemId));

    const candidates = rows.filter(
      (r) => r.cate && r.cate !== "none" && (!requireValue || r.value) && !selectedIds.has(r.itemId)
    );

    if (candidates.length === 0) {
      openAlert({ message: requireValue ? "검색항목과 값을 모두 입력해주세요." : "검색항목을 선택해주세요." });
      return;
    }
    if (candidates.some((c) => selected.some((s) => s.type === type && s.cate === c.cate))) {
      openAlert({ message: "이미 선택된 조건입니다." });
      return;
    }

    setValue("searchSelected", [...selected, ...candidates] as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    append(makeEmptyRow(type) as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  }, [getValues, setValue, openAlert, append, fieldName, type, requireValue]);

  const delItem = useCallback(
    (index: number, itemId: string) => {
      if (fields.length <= 1 || index === fields.length - 1) return;
      remove(index);
      const selected = (getValues("searchSelected") ?? []) as Partial<SearchItem>[];
      setValue("searchSelected", selected.filter((s) => s.itemId !== itemId) as any); // eslint-disable-line @typescript-eslint/no-explicit-any
      if (focusedItemId === itemId) setFocusedItemId(null);
    },
    [fields.length, remove, getValues, setValue, focusedItemId, setFocusedItemId]
  );

  const handleRowClick = useCallback(
    (itemId: string) => setFocusedItemId(focusedItemId === itemId ? null : itemId),
    [focusedItemId, setFocusedItemId]
  );

  return { fields, watched, addItem, delItem, handleRowClick };
}
