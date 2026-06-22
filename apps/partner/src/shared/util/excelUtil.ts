import * as XLSX from "xlsx";
import type { ColumnDef } from "@tanstack/react-table";

/**
 * 객체에서 점(.)으로 구분된 경로를 통해 값을 가져오는 헬퍼 함수
 * 예: getValueByPath(obj, 'appClassification.codeName')
 */
const getValueByPath = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

/**
 * JSON 데이터를 Excel(.xlsx) 형식으로 변환하여 다운로드하는 유틸리티
 */
export const downloadExcel = (
  data: any[], 
  fileName: string = "export_data",
  columns?: ColumnDef<any>[]
) => {
  if (!data || data.length === 0) {
    alert("다운로드할 데이터가 없습니다. 먼저 목록을 조회해 주세요.");
    return;
  }

  try {
    let exportData = [];

    if (columns) {
      // 1. 컬럼 정의가 있는 경우: 헤더 매핑 및 노출할 컬럼만 추출
      const activeColumns = columns.filter(col => 
        (col as any).accessorKey && typeof col.header === "string"
      );

      exportData = data.map(item => {
        const newItem: any = {};
        activeColumns.forEach(col => {
          const key = (col as any).accessorKey;
          const label = col.header as string;
          let val = getValueByPath(item, key);

          // 객체인 경우 처리
          if (val && typeof val === "object" && !(val instanceof Date)) {
            val = val.codeName || val.userName || val.name || "";
          }
          
          newItem[label] = val ?? "";
        });
        return newItem;
      });
    } else {
      // 2. 컬럼 정의가 없는 경우: 기존 방식 (평탄화만 수행)
      exportData = data.map((item) => {
        const newItem: any = {};
        Object.keys(item).forEach((key) => {
          let val = item[key];
          if (val && typeof val === "object" && !(val instanceof Date)) {
            val = val.codeName || val.userName || val.name || "";
          }
          newItem[key] = val ?? "";
        });
        return newItem;
      });
    }

    // 2. 워크북 및 워크시트 생성
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // 3. 파일 쓰기 및 다운로드 트리거
    const fullFileName = `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fullFileName);

    console.log("Excel 다운로드 완료:", fullFileName);
  } catch (error) {
    console.error("Excel 다운로드 실패:", error);
    alert("파일 생성 중 오류가 발생했습니다.");
  }
};
