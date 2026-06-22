import { Button, DataTable, Icons, Separator } from "@repo/ui";
import React from "react";
import { approveColumns } from "./columns/approveColumns";
import { AddApproveTemplate } from "./_components/AddApproveTemplate";

const testData = [
  {
    id: "12345678",
    fileNm: "서식명이 노출 됩니다.",
    line: [
      {
        type: "결재",
        pos: "1차 상위 부서장",
      },
      {
        type: "결재",
        pos: "2차 상위 부서장",
      },
    ],
  },
];

export const ApproveMng = () => {
  const onOpenChange = () => {};

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div>
        <h2 className="font-semibold">결재선 탬플릿 설정</h2>
      </div>

      <Separator className="border-t" />

      <div data-group="approve-group">
        <div className="flex py-2">
          <h2 className="text-sm">결재선</h2>
          <Button variant="outline" size="h24" className="ml-auto">
            <Icons.Plus /> 결재선 추가
          </Button>
        </div>
        <DataTable
          data={testData}
          columns={approveColumns}
          // columnPinning={{ right: ["action"] }}
          enableMultiRowSelection={false}
          size="sm"
          className="max-h-70"
          getRowId={(row) => String(row.id)}
        />
      </div>

      <div data-group="approve-group">
        <div className="flex py-2">
          <h2 className="text-sm">수신 그룹</h2>
          <Button variant="outline" size="h24" className="ml-auto">
            <Icons.Plus /> 수신그룹 추가
          </Button>
        </div>
        <DataTable
          data={testData}
          columns={approveColumns}
          // columnPinning={{ right: ["action"] }}
          enableMultiRowSelection={false}
          size="sm"
          className="max-h-70"
        />
      </div>

      <div data-group="approve-group">
        <div className="flex py-2">
          <h2 className="text-sm">공유 그룹</h2>
          <Button variant="outline" size="h24" className="ml-auto">
            <Icons.Plus /> 공유그룹 추가
          </Button>
        </div>
        <DataTable
          data={testData}
          columns={approveColumns}
          // columnPinning={{ right: ["action"] }}
          enableMultiRowSelection={false}
          size="sm"
          className="max-h-70"
        />
      </div>

      <AddApproveTemplate open={true} onOpenChange={onOpenChange} />
    </div>
  );
};
