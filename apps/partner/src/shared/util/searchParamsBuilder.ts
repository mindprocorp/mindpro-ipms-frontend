/**
 * PageSearchForm의 values를 백엔드 BaseSearchRequest 형식으로 변환
 */
export function buildSearchParams(values: any, pageSize = 20) {
  const searchCondition: Array<Record<string, string>> = [];
  const dateFilters: Array<Record<string, string>> = [];
  const textFilters: Array<Record<string, string>> = [];

  if (values.parms) {
    for (const p of values.parms) {
      const andOrNOT = p.condition === "exclusion" ? "NOT" : "AND";

      if (p.type === "date") {
        dateFilters.push({
          dateCode: p.cateCode,
          startDate: (p.fromValue || "").replace(/-/g, ""),
          endDate: (p.toValue || "").replace(/-/g, ""),
          andOrNOT,
        });
      } else if (p.type === "string") {
        textFilters.push({
          codeName: p.cateCode,
          codeValue: p.valueCode || "",
          andOrNOT,
        });
      } else {
        searchCondition.push({
          codeName: p.cateCode,
          codeValue: p.valueCode || "",
          andOrNOT,
        });
      }
    }
  }

  return {
    page: 1,
    pageSize,
    searchCondition,
    dateFilters,
    textFilters,
  };
}
