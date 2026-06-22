import { Button, DataTable, FlexBox, FormDialog, GN, RHF } from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FlatTab } from "@shared/ui/tab/ui/Tabs";
import FlatItem from "@shared/ui/tab/ui/FlatItem";
import { prepaymentSearchColumns, type PrepaymentSearchData } from "./columns/PrepaymentSearchCol";

const mockGeneralPrepaymentData: PrepaymentSearchData[] = [
  {
    prepaymentSeq: "PRE20260000001",
    depositDate: "2026-01-15",
    depositAmount: "1,000,000",
    generalBalance: "500,000",
    designatedBalance: "0",
  },
  {
    prepaymentSeq: "PRE20260000003",
    depositDate: "2026-03-01",
    depositAmount: "500,000",
    generalBalance: "300,000",
    designatedBalance: "0",
  },
];

const mockDesignatedPrepaymentData: PrepaymentSearchData[] = [
  {
    prepaymentSeq: "PRE20260000002",
    depositDate: "2026-02-20",
    depositAmount: "2,000,000",
    generalBalance: "0",
    designatedBalance: "1,500,000",
  },
  {
    prepaymentSeq: "PRE20260000004",
    depositDate: "2026-03-10",
    depositAmount: "3,000,000",
    generalBalance: "0",
    designatedBalance: "2,000,000",
  },
];

export const PrepaymentSearchModal = ({ title = "선수금 조회", open, onOpenChange, onSuccess }: ModalProps) => {
  const [activeTab, setActiveTab] = useState<string>("일반선수금");
  const [selectedRow, setSelectedRow] = useState<PrepaymentSearchData | null>(null);

  const currentData = activeTab === "일반선수금" ? mockGeneralPrepaymentData : mockDesignatedPrepaymentData;

  const form = useForm({
    defaultValues: {
      searchKeyword: "",
    },
  });

  const handleSearch = () => {
    console.log("검색:", form.getValues("searchKeyword"));
  };

  const handleSelect = (_row: import("@tanstack/react-table").Row<PrepaymentSearchData>, rowData: PrepaymentSearchData) => {
    setSelectedRow(rowData);
  };

  const handleConfirm = () => {
    if (selectedRow) {
      onSuccess?.(selectedRow as any);
      onOpenChange?.(false);
    }
  };

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={handleConfirm}
        submitText="선택"
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-4xl!"
      >
        <FlexBox vertical className="gap-4">
          <FlatTab className="border-border-100 mb-2 border-y px-3 pt-2">
            <FlexBox>
              <FlatItem
                label="일반선수금"
                value="일반선수금"
                active={activeTab}
                onClick={() => setActiveTab("일반선수금")}
              />
              <FlatItem
                label="지정선수금"
                value="지정선수금"
                active={activeTab}
                onClick={() => setActiveTab("지정선수금")}
              />
            </FlexBox>
            <GN.CheckBox size="sm" name="zero" label="잔액이 0인것도 포함" />
          </FlatTab>

          <FlexBox className="items-end gap-2">
            <RHF.Input
              control={form.control}
              name="searchKeyword"
              label="검색어"
              placeholder="선수금 입금번호 입력"
              className="w-60"
            />
            <Button type="button" onClick={handleSearch} variant="outline">
              검색
            </Button>
          </FlexBox>

          <DataTable
            columns={prepaymentSearchColumns}
            data={currentData}
            onRowClick={handleSelect}
            getSelectedRow={(items) => {
              if (items && items.length > 0) {
                setSelectedRow(items[0]);
              } else {
                setSelectedRow(null);
              }
            }}
            className="h-80"
          />

          {/* {selectedRow && (
            <FlexBox vertical className="gap-2 p-4 bg-gray-50 rounded">
              <FlexBox>
                <RHF.Input
                  name="selectedPrepaymentSeq"
                  label="선수금 입금번호"
                  value={selectedRow.prepaymentSeq}
                  disabled
                />
                <RHF.Input
                  name="selectedDepositDate"
                  label="입금일"
                  value={selectedRow.depositDate}
                  disabled
                />
                <RHF.Input
                  name="selectedDepositAmount"
                  label="입금액"
                  value={selectedRow.depositAmount}
                  disabled
                />
              </FlexBox>
              <FlexBox>
                <RHF.Input
                  name="selectedGeneralBalance"
                  label="일반선수금 잔액"
                  value={selectedRow.generalBalance}
                  disabled
                />
                <RHF.Input
                  name="selectedDesignatedBalance"
                  label="지정선수금 잔액"
                  value={selectedRow.designatedBalance}
                  disabled
                />
              </FlexBox>
            </FlexBox>
          )} */}
        </FlexBox>
      </FormDialog>
    </FormProvider>
  );
};
