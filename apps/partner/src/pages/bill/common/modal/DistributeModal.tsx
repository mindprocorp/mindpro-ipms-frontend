import {
  Button,
  DataTable,
  FlexBox,
  FormDialog,
  Icons,
  Separator
} from "@repo/ui";
import React, { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { DistribteAddItem } from "./DistributeAddItem";
import {
  type DistributeColType,
  getDistributeColumns,
} from "@pages/common/bottom/modal/columns/DistributeCol.tsx";
import { useMutation } from "@tanstack/react-query";
import { bottomQueries } from "@shared/query/common/bottomQueries.ts";
import { billTabsQueries, billDomesticQueries } from "@shared/query/bill/billTabsQueries.ts";
import {
  type MemoModalFormOutput,
  memoModalSchema,
} from "@shared/schema/common/modal/memoModalSchema.ts";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
// import { columnsData } from "./columns/columnsData"; // 실제 컬럼 데이터 임포트

type DiSuccessData = {
  callbackData: any;
};

type DistributeModalProps = {
  propData?: any;
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (rtnData: DiSuccessData) => void;
  masterPerfAmount: number;
};

export const DistributeModal = ({
  title,
  open,
  onOpenChange,
  onSuccess,
  propData,
  masterPerfAmount,
}: DistributeModalProps) => {
  const form = useForm();
  const [addItemOpen, setAddItemOpen] = useState(false);
  const createDistributeMutation = useMutation(bottomQueries.createDistribute());
  const getPerformanceListMutation = useMutation(billTabsQueries.getPerformanceList());
  const { openAlert } = useAlertStore();

  // 데이터 상태
   const [sourceData, setSourceData] = useState<any[]>([]);
  const [targetData, setTargetData] = useState<DistributeColType[]>([]);
  const [targetAllData, setTargetAllData] = useState<any[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [editItemIndex, setEditItemIndex] = useState<number | null>(null);



  useEffect(() => {
    if (open && propData) {
      form.reset();
      
      // 기존 실적 분배 목록 조회
      getPerformanceListMutation.mutate(propData, {
        onSuccess: (res) => {
          const list = res.data.list || [];
          setTargetData(list);
          setTargetAllData(list);
        }
      });
    }
  }, [open, propData, form]);

  const onSubmit = () => {
    const totalAmount = targetData.reduce((acc, cur) => acc + Number(cur.performanceAmount || 0), 0);
    const totalRatio = targetData.reduce((acc, cur) => acc + Number(cur.shareRatio || 0), 0);
    
    if (totalAmount > masterPerfAmount) {
      openAlert({
        message: `실적분배금액의 합계(${totalAmount.toLocaleString()})가 실적인정금액(${masterPerfAmount.toLocaleString()})을 초과할 수 없습니다.`,
        confirmText: "확인"
      });
      return;
    }

    if (totalRatio > 100) {
      openAlert({
        message: `기여율의 합계(${totalRatio}%)가 100%를 초과할 수 없습니다.`,
        confirmText: "확인"
      });
      return;
    }

    openAlert({
      className: "w-[400px]",
      message: "저장하시겠습니까?",
      confirmText: "확인",
      cancelText: "취소",
      onConfirm: () => {
        const newTargetData = targetAllData.map((item) => ({
          ...item,
          invoiceSeq: propData,
        }));

        const param = {
          payload: newTargetData,
          invoiceSeq: propData as string,
        };

        console.log("Submitting bulk distribute data:", param);
        createDistributeMutation.mutate(param, {
          onSuccess: (response) => {
            onSuccess?.({ callbackData: "DISTRIBUTE" });
            onOpenChange(false); // 저장 후 모달 닫기
          },
          onError: (error: any) => {
            console.error("Save failed:", error);
            openAlert({
              message: "저장 중 오류가 발생했습니다. 데이터를 확인해주세요.",
              confirmText: "확인"
            });
          }
        });
      },
    });
  };

  const onAddItemSuccess = (values: any) => {
    const newAmount = Number(values.performanceAmount || 0);
    const newRatio = Number(values.shareRatio || 0);
    
    const currentTotal = targetData.reduce((acc, cur, idx) => {
      // 수정 모드일 경우 현재 수정 중인 항목의 기존 금액은 제외하고 합산
      if (editItemIndex !== null && idx === editItemIndex) return acc;
      return acc + Number(cur.performanceAmount || 0);
    }, 0);

    const currentTotalRatio = targetData.reduce((acc, cur, idx) => {
      if (editItemIndex !== null && idx === editItemIndex) return acc;
      return acc + Number(cur.shareRatio || 0);
    }, 0);

    if (currentTotal + newAmount > masterPerfAmount) {
      openAlert({
        message: `입력한 금액을 포함한 합계(${(currentTotal + newAmount).toLocaleString()})가 실적인정금액(${masterPerfAmount.toLocaleString()})을 초과할 수 없습니다.`,
        confirmText: "확인"
      });
      return;
    }

    if (currentTotalRatio + newRatio > 100) {
      openAlert({
        message: `입력한 기여율을 포함한 합계(${(currentTotalRatio + newRatio)}%)가 100%를 초과할 수 없습니다.`,
        confirmText: "확인"
      });
      return;
    }

    const distributeData: DistributeColType = {
      staff: {
        userSeq: values.staff?.userSeq,
        userName: values.staff?.userName,
      },
      deptCategory: values.deptCategory,
      performanceCategory: {
        code: values.performanceCategory?.code,
        codeName: values.performanceCategory?.codeName,
      },
      shareRatio: values.shareRatio,
      performancePerfDate: values.performancePerfDate,
      performanceAmount: values.performanceAmount,
      note: values.note,
      invoiceSeq: propData as string,
      performanceSeq: values.performanceSeq,
    };

    if (editItemIndex !== null) {
      const newTargetData = [...targetData];
      const newTargetAllData = [...targetAllData];
      newTargetData[editItemIndex] = distributeData;
      newTargetAllData[editItemIndex] = values;
      setTargetData(newTargetData);
      setTargetAllData(newTargetAllData);
    } else {
      setTargetData((prev) => [...prev, distributeData]);
      setTargetAllData((prev) => [...prev, values]);
    }
    setAddItemOpen(false);
    setEditItemIndex(null);
  }

  const handleRowClick = (row: any) => {
    setEditItemIndex(row.index);
    setAddItemOpen(true);
  };

  const onError = (errors: any) => {
    console.log(" Zod errors:", errors);
  };

  return (
    <>
      <FormProvider {...form}>
        <FormDialog
          title={title}
          onSubmit={form.handleSubmit(onSubmit, onError)}
          submitText="저장"
          open={open}
          onOpenChange={onOpenChange}
          className="max-w-320!" // Modal32 스타일의 넓은 폭 유지
        >
          <Separator className="mb-4 border-t" />

          <FlexBox className="gap-2">
            <div className="min-w-0 flex-1">
              <FlexBox className="mb-2">
                <p className="text-sm font-medium">실적인정금액 정보</p>
              </FlexBox>
              <div className="h-70 rounded border border-border-200 bg-gray-50 p-4">
                <FlexBox vertical className="gap-4">
                  <FlexBox className="justify-between">
                    <span className="text-sm text-gray-600">총 실적인정금액</span>
                    <span className="text-lg font-bold text-blue-600">
                      {masterPerfAmount.toLocaleString()} 원
                    </span>
                  </FlexBox>
                  <Separator className="border-t border-dashed" />
                  <FlexBox className="justify-between">
                    <span className="text-sm text-gray-600">분배 합계 금액</span>
                    <span className="text-lg font-bold text-red-600">
                      {targetData.reduce((acc, cur) => acc + Number(cur.performanceAmount || 0), 0).toLocaleString()} 원
                    </span>
                  </FlexBox>
                  <FlexBox className="justify-between">
                    <span className="text-sm text-gray-600">잔여 분배 가능 금액</span>
                    <span className="text-base font-medium">
                      {(masterPerfAmount - targetData.reduce((acc, cur) => acc + Number(cur.performanceAmount || 0), 0)).toLocaleString()} 원
                    </span>
                  </FlexBox>
                </FlexBox>
              </div>
            </div>

            {/* [중앙 영역] 제거됨 */}


            {/* [오른쪽 영역] 실적대상 설정 */}
            <div className="min-w-0 flex-1">
              <FlexBox className="mb-2 justify-between">
                <p className="text-sm font-medium">실적대상 설정</p>
                <div className="flex gap-1">
                  <Button variant="outline" size="h24" onClick={() => {
                    setEditItemIndex(null);
                    setAddItemOpen(true);
                  }}>
                    <Icons.Plus />
                    추가
                  </Button>
                  <Button
                    variant="outline"
                    size="h24"
                    onClick={() => {
                      const selectedIndices = Object.keys(rowSelection)
                        .filter((key) => rowSelection[key])
                        .map((key) => parseInt(key));
                      
                      if (selectedIndices.length === 0) return;

                      const newTargetData = targetData.filter((_, idx) => !selectedIndices.includes(idx));
                      const newTargetAllData = targetAllData.filter((_, idx) => !selectedIndices.includes(idx));
                      
                      setTargetData(newTargetData);
                      setTargetAllData(newTargetAllData);
                      setRowSelection({});
                    }}
                    disabled={Object.keys(rowSelection).length === 0}
                  >
                    <Icons.Trash />
                    삭제
                  </Button>
                </div>
              </FlexBox>
              <DataTable
                data={targetData}
                columns={getDistributeColumns(false)}
                size="sm"
                className="h-70"
                enableRowSelection
                rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
                onRowClick={handleRowClick}
              />
            </div>
          </FlexBox>
        </FormDialog>
      </FormProvider>

      {/* 추가 모달 */}
      <DistribteAddItem
        open={addItemOpen}
        onOpenChange={(open) => {
          setAddItemOpen(open);
          if (!open) setEditItemIndex(null);
        }}
        onSuccess={onAddItemSuccess}
        title={editItemIndex !== null ? "실적분배 수정" : "실적분배 추가"}
        editData={editItemIndex !== null ? targetAllData[editItemIndex] : null}
      />
    </>
  );
};
