import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";

export type DashboardSummaryData = {
  total: number;
  newRequest: number;
  modifiedRequest: number;
  domesticAccept: number;
  overseasAccept: number;
  inProgress: number;
  completed: number;
};

export type DashboardChartData = {
  name: string;
  value: number;
  fill: string;
};

export type DashboardMonthlyData = {
  month: string;
  newRequest: number;
  domesticAccept: number;
  overseasAccept: number;
  quotationRequest: number;
  searchRequest: number;
};

export type DashboardRecentCase = {
  appSeq: string;
  appNo: string;
  titleKo: string;
  appState: { code: string; codeName: string };
  state: { code: string; codeName: string };
  createDate: string;
  rightCategory: string;
};

export type DashboardOverviewResponse = {
  summaryData: DashboardSummaryData;
  statusData: DashboardChartData[];
  countryData: DashboardChartData[];
  rightData: DashboardChartData[];
  monthlyData: DashboardMonthlyData[];
  recentList: DashboardRecentCase[];
};

export function dashboardApi(client: ApiClient) {
  return {
    getOverview: async (
      startDate?: string,
      endDate?: string,
      year?: number
    ): Promise<ApiResponse<DashboardOverviewResponse>> => {
      const { data } = await client.axios.get<ApiResponse<DashboardOverviewResponse>>(
        `/api/dashboard/summary`,
        {
          params: { startDate, endDate, year },
        }
      );
      return data;
    },
  };
}
