import { QueryClient as qc } from "@tanstack/react-query";

export const QueryClient = new qc({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // 1분은 신선
      gcTime: 5 * 60_000, // 5분 캐시 유지
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
