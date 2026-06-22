import type { ColumnDef } from "@tanstack/react-table";

const getValueByPath = (obj: any, path: string) => {
  if (!path) return undefined;
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

/**
 * 목록 데이터를 HTML 테이블로 생성하여 새 창에서 인쇄하는 유틸리티
 */
export const triggerPrint = (data?: any[], fileName: string = "인쇄_목록", columns?: ColumnDef<any>[]) => {
  if (!data || data.length === 0) {
    alert("인쇄할 데이터가 없습니다. 먼저 목록을 조회해 주세요.");
    return;
  }

  try {
    let headers: string[] = [];
    let rows: any[][] = [];

    if (columns) {
      // accessorKey 또는 id 둘 중 하나라도 있고 header 가 문자열인 컬럼 모두 포함
      const activeColumns = columns.filter(col =>
        ((col as any).accessorKey || (col as any).id) && typeof col.header === "string"
      );
      headers = activeColumns.map(col => col.header as string);

      rows = data.map(item => {
        return activeColumns.map(col => {
          const key = (col as any).accessorKey || (col as any).id;
          let val = getValueByPath(item, key);
          if (val && typeof val === "object" && !(val instanceof Date)) {
            val = val.codeName || val.userName || val.name || "";
          }
          return val ?? "";
        });
      });
    } else {
      if (data.length > 0) {
        headers = Object.keys(data[0]);
        rows = data.map(item => {
          return headers.map(key => {
            let val = item[key];
            if (val && typeof val === "object" && !(val instanceof Date)) {
              val = val.codeName || val.userName || val.name || "";
            }
            return val ?? "";
          });
        });
      }
    }

    const html = `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <title>${fileName}</title>
        <style>
          body { font-family: 'Malgun Gothic', sans-serif; padding: 20px; }
          h1 { text-align: center; font-size: 20px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          th, td { border: 1px solid #888; padding: 6px; text-align: center; word-break: break-all; }
          th { background-color: #f1f5f9; font-weight: bold; }
          @media print {
            @page { size: landscape; margin: 10mm; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>${fileName}</h1>
        <table>
          <thead>
            <tr>
              ${headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr>
                ${row.map(cell => `<td>${cell}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // 팝업 창 대신 숨겨진 iframe을 생성하여 인쇄 처리
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();

      iframe.onload = () => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();

        // 인쇄 다이얼로그 호출 후 iframe 제거
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      };
    }

  } catch (error) {
    console.error("인쇄 처리 중 오류:", error);
    alert("파일 생성 중 오류가 발생했습니다.");
  }
};
