import { z } from "zod";

/**
 * 대시보드 검색 조건 스킬
 */
export const DashboardSearchSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  year: z.number().default(new Date().getFullYear()),
});

export type DashboardSearchInput = z.infer<typeof DashboardSearchSchema>;

/**
 * 최근 사건 리스트 아이템 타입 (API 응답 기준)
 */
export const DashboardRecentCaseSchema = z.object({
  appSeq: z.string(),
  appNo: z.string().optional(),
  titleKo: z.string().optional(),
  appState: z.object({ code: z.string(), codeName: z.string() }).optional(),
  state: z.object({ code: z.string(), codeName: z.string() }).optional(),
  createDate: z.string().optional(),
  rightCategory: z.string().optional(),
});

export type DashboardRecentCase = z.infer<typeof DashboardRecentCaseSchema>;
