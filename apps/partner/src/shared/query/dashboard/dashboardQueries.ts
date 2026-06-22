import { queryOptions } from "@tanstack/react-query";
import { dashboardApi } from "@shared/api/dashboard/dashboardApi";
import { apiClient } from "../../../shared/api/client";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  // officeSeq 가 키에 포함돼서 사무소 전환 시 자동으로 별도 캐시 entry 사용 → 다른 사무소 데이터 누수 방지
  overview: (officeSeq?: string, startDate?: string, endDate?: string, year?: number) =>
    [...dashboardKeys.all, "overview", { officeSeq, startDate, endDate, year }] as const,
};

export const dashboardQueries = {
  getOverview: (officeSeq?: string, startDate?: string, endDate?: string, year?: number) =>
    queryOptions({
      queryKey: dashboardKeys.overview(officeSeq, startDate, endDate, year),
      queryFn: () => dashboardApi(apiClient).getOverview(startDate, endDate, year),
      staleTime: 5 * 60 * 1000,
      enabled: !!officeSeq,
    }),
};
