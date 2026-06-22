import { useMemo, useState } from "react";
import { FormDialog, RHF } from "@repo/ui";
import { FormProvider, useForm } from "react-hook-form";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@repo/ui";
import { systemPlansApi, type OfficeVO } from "@shared/api/system/systemApi";
import { useAlertStore } from "@shared/store/useAlertStore";
import { selectColumn } from "@shared/util/selectColumn";

/**
 * 플랜에 배정할 사무소 선택 모달.
 * - 모든 사무소 + 현재 배정된 플랜명 표시
 * - 현재 플랜과 동일한 사무소는 체크 불가 (이미 속함)
 * - 다른 플랜의 사무소를 선택하면 재배정(plan_seq UPDATE)
 */
interface OfficeSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (officeSeqs: string[]) => void;
  currentPlanSeq?: string;  // 현재 보고 있는 플랜 (이 플랜에 속한 사무소는 비활성)
  title?: string;
}

export const OfficeSelectModal = ({
  open,
  onOpenChange,
  onConfirm,
  currentPlanSeq,
  title = "사무소 선택",
}: OfficeSelectModalProps) => {
  const { openAlert } = useAlertStore();
  const form = useForm({ defaultValues: { searchKeyword: "" } });
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const { data: offices = [], isLoading } = systemPlansApi.useAllOfficesForAssign();

  const keyword = form.watch("searchKeyword");
  const filtered = useMemo(
    () =>
      keyword
        ? offices.filter((o) =>
            (o.officeShortName ?? "").toLowerCase().includes(keyword.toLowerCase()) ||
            (o.currentPlanNm ?? "").toLowerCase().includes(keyword.toLowerCase()),
          )
        : offices,
    [offices, keyword],
  );

  // 컬럼 정의 (외부 state 의존성 없이 stable) — 체크박스는 DataTable의 rowSelection으로 처리
  const COLUMNS: ColumnDef<OfficeVO>[] = useMemo(() => [
    selectColumn<OfficeVO>(36),
    { accessorKey: "officeShortName", header: "사무소명", size: 180 },
    {
      accessorKey: "currentPlanNm",
      header: "현재 플랜",
      size: 110,
      cell: ({ getValue, row }) => {
        const planNm = getValue() as string;
        const isCurrent = currentPlanSeq && row.original.planSeq === currentPlanSeq;
        return (
          <div className={`text-center text-xs ${isCurrent ? "text-p-color-1 font-semibold" : "text-text-200"}`}>
            {planNm ?? "(미배정)"}
            {isCurrent && " (현재)"}
          </div>
        );
      },
    },
    {
      accessorKey: "officeAuthYn", header: "사업자 인증", size: 90,
      cell: ({ getValue }) => {
        const v = getValue() as string;
        return <div className={`text-center ${v === "Y" ? "text-p-color-1" : "text-text-200"}`}>{v ?? "N"}</div>;
      },
    },
  ], [currentPlanSeq]);

  const proceed = (selectedSeqs: string[]) => {
    onConfirm(selectedSeqs);
    setChecked({});
    onOpenChange(false);
  };

  const handleConfirm = () => {
    const selectedSeqs = Object.keys(checked).filter((k) => checked[k]);
    if (selectedSeqs.length === 0) {
      openAlert({ message: "사무소를 선택해주세요." });
      return;
    }
    // 다른 플랜에서 이동되는 건수 확인 → 공용 confirm
    const movingCount = selectedSeqs.filter((seq) => {
      const o = offices.find((x) => x.officeSeq === seq);
      return o?.planSeq && o.planSeq !== currentPlanSeq;
    }).length;
    if (movingCount > 0) {
      openAlert({
        type: "confirm",
        message: `${selectedSeqs.length}개 중 ${movingCount}개 사무소는 다른 플랜에서 이동됩니다.\n진행할까요?`,
        onConfirm: () => proceed(selectedSeqs),
      });
      return;
    }
    proceed(selectedSeqs);
  };

  return (
    <FormProvider {...form}>
      <FormDialog
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        onSubmit={handleConfirm}
      >
        <div className="flex flex-col gap-3 py-2">
          <RHF.Input
            control={form.control}
            name="searchKeyword"
            placeholder="사무소명/플랜명 검색"
            className="w-full"
          />
          {isLoading ? (
            <p className="text-text-200 flex h-[55vh] items-center justify-center text-sm">사무소 목록을 불러오는 중...</p>
          ) : offices.length === 0 ? (
            <p className="text-text-200 flex h-[55vh] items-center justify-center text-sm">등록된 사무소가 없습니다.</p>
          ) : filtered.length === 0 ? (
            <p className="text-text-200 flex h-[55vh] items-center justify-center text-sm">검색 결과가 없습니다.</p>
          ) : (
            <DataTable
              data={filtered}
              columns={COLUMNS}
              className="max-h-[55vh] overflow-auto"
              getRowId={(row) => row.officeSeq}
              enableRowSelection={(row) =>
                !(currentPlanSeq && row.original.planSeq === currentPlanSeq)
              }
              rowSelection={checked}
              onRowSelectionChange={setChecked}
            />
          )}
          <p className="text-text-200 text-xs">
            ※ 현재 플랜과 동일한 사무소는 체크할 수 없습니다. 다른 플랜의 사무소를 선택하면 이 플랜으로 이동됩니다.
          </p>
        </div>
      </FormDialog>
    </FormProvider>
  );
};
