import type { CodeDetail, CodeDocumentListType, CodeSelectOption, } from "@shared/api/common/commApi.ts";
import type { ProgressItemType } from "@shared/api/common/commBottomApi.ts";

export const isEmpty = (v: unknown): boolean =>
  v === undefined || v === null || (typeof v === "string" && v.trim() === "");

export const mapToOptionNew = (list: CodeDetail[]): CodeSelectOption[] =>
  list.map(({ dtlCd, cdNm }) => ({
    value: dtlCd,
    label: cdNm,
  }));

export const mapToDocOption = (list: CodeDocumentListType[]): CodeSelectOption[] =>
  list.map(({ docSeq, docNm }) => ({
    value: docSeq,
    label: docNm,
  }));

export const sanitizeNulls = (obj: any): any => {
  if (obj === null) return "";
  if (Array.isArray(obj)) return obj.map(sanitizeNulls);
  if (typeof obj === "object") {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, sanitizeNulls(v)]));
  }
  return obj;
};


