import { Button, Icons } from "@repo/ui";
import { downloadExcel } from "@shared/util/excelUtil";
import { triggerPrint } from "@shared/util/printUtil";
import { useAlertStore } from "@shared/store/useAlertStore";
import type { ColumnDef } from "@tanstack/react-table";

interface DataMenuButtonProps {
  data?: any[];
  fileName?: string;
  columns?: ColumnDef<any>[];
  showPrint?: boolean;
  onExcelClick?: () => void | Promise<void>;
}

const DataMenuButton = ({ data, fileName, columns, showPrint = true, onExcelClick }: DataMenuButtonProps) => {
  const { openAlert } = useAlertStore();

  const handleExcelDownload = () => {
    if (onExcelClick) {
      onExcelClick();
      return;
    }
    if (data && data.length > 0) {
      downloadExcel(data, fileName, columns);
    } else {
      openAlert({ message: "다운로드할 데이터가 없습니다. 목록을 먼저 조회해주세요." });
    }
  };

  return (
    <>
      <Button size="h28" type="button" onClick={handleExcelDownload}>
        <Icons.FileSpreadsheet />
        엑셀
      </Button>
      {showPrint && (
        <Button size="h28" type="button" onClick={() => triggerPrint(data, fileName, columns)}>
          <Icons.Printer />
          인쇄
        </Button>
      )}
    </>
  );
};

export default DataMenuButton;
