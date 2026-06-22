import { DataTable, FlexBox, FormDialog } from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import {
  type ExcelLogColType,
  excelLogColumnsData,
} from "./columns/excelLogColumnsData.tsx";
import { useState } from "react";

const ExcelLogModal = ({ title, open, onOpenChange }: ModalProps) => {
  const [listData, setListData] = useState<ExcelLogColType[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  const onSubmit = () => {
    onOpenChange(false);
  };

  return (
    <FormDialog
      title={title}
      onSubmit={onSubmit}
      submitText="확인"
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-250!"
      bodyFull
    >
      <FlexBox className="px-3 pb-2">
        <p className="text-text-200 text-sm">
          총 <span className="text-p-color-1 font-bold">{totalCount.toLocaleString()}</span>건의 결과가 있습니다.
        </p>
      </FlexBox>
      <DataTable
        data={listData}
        columns={excelLogColumnsData}
        height={400}
      />
    </FormDialog>
  );
};

export default ExcelLogModal;
