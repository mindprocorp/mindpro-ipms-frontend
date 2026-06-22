import { apiClient } from "@shared/api/client";
import { niceProductApi, type ClassResponse, type NiceProductResponse } from "./api/niceProductApi";
import { useInfiniteTableQuery } from "@shared/hooks/useInfiniteTableQuery";

const fetchMasterData = async (args: { start: number; pageSize: number }) => {
  const fetchedData = await niceProductApi(apiClient).getMasterList();
  const dbData = [...fetchedData.data];
  return {
    data: dbData.slice(args.start, args.start + args.pageSize),
    meta: {
      totalRowCount: dbData.length,
    },
  };
};

// const fetchClassData = async (args: { start: number; pageSize: number }) => {
//   const fetchedData = await niceProductApi(apiClient).getClassList();
//   const dbData = [...fetchedData.data];
//   return {
//     data: dbData.slice(args.start, args.start + args.pageSize),
//     meta: {
//       totalRowCount: dbData.length,
//     },
//   };
// };

export function useProductsInfiniteTable({ pageSize = 10 }: { pageSize: number }) {
  return useInfiniteTableQuery<NiceProductResponse>({
    queryKeyBase: ["masterList", "infinite"],
    pageSize: pageSize,
    queryFn: fetchMasterData,
  });
}

// export function useClassInfiniteTable({ pageSize = 10, classNo }: { pageSize: number, classNo:string }) {
//   return useInfiniteTableQuery<ClassResponse>({
//     queryKeyBase: ["class", "infinite"],
//     pageSize: pageSize,
//     queryFn: fetchClassData,
//   });
// }
