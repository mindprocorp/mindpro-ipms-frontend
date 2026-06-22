import { CustomScrollArea, FormDialog, DataTable, InputGroup, InputGroupInput, InputGroupAddon, Icons } from "@repo/ui";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type TestFormInput, TestSchema } from "../../../pub/schema.ts";
import { useAppSearch } from "./model/useAppSearch";
import { columnsData } from "../ourref/columns/columnsData.tsx";
import { type SearchAppItem } from "@shared/api/common/commApi.ts";

export type InputKeyInfoType = {
  inputKey: string;
  inputName: string;
};

export type SuccessOurRefData = {
  input: InputKeyInfoType;
  ourRefInfo: SearchAppItem[];
};

type UserModalProps = {
  input: InputKeyInfoType;
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (rtnData: SuccessOurRefData) => void;
};

export const AppSearchModal = ({ title, open, onOpenChange, onSuccess, input }: UserModalProps) => {
  const form = useForm<TestFormInput>({
    resolver: zodResolver(TestSchema),
    defaultValues: TestSchema.parse({}),
  });

  const { appList, memFind, clearCheck, isLoading } = useAppSearch();

  const handleSelect = (_row: any, rowData: SearchAppItem) => {
    const rtnData: SuccessOurRefData = {
      ourRefInfo: [rowData],
      input,
    };

    onSuccess?.(rtnData);
    onOpenChange(false);
    clearCheck();
  };

  const onSubmit = () => {
    onOpenChange(false);
  };

  function onChangeModal(isOpen: boolean) {
    if (!isOpen) clearCheck();
    onOpenChange(isOpen);
  }

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title || "출원번호로 사건 선택"}
        onSubmit={onSubmit}
        submitText="확인"
        open={open}
        onOpenChange={onChangeModal}
        className="max-w-[1200px]!"
        bodyFull
      >
        <div className="flex flex-col h-[650px]">
          {/* 검색 바 영역 */}
          <div className="border-border-100 bg-bg-50 dark:border-input dark:bg-background-color flex items-center justify-between border-b p-3">
            <div className="flex items-center gap-4 w-full">
              <InputGroup className="bg-bg-50 w-full">
                <InputGroupInput onChange={memFind} placeholder="출원번호로 검색" />
                <InputGroupAddon>
                  <Icons.Search />
                </InputGroupAddon>
              </InputGroup>
              {isLoading && (
                <div className="flex items-center gap-2 text-blue-500 text-sm animate-pulse">
                  <span>데이터를 불러오는 중입니다...</span>
                </div>
              )}
            </div>
          </div>

          {/* 테이블 데이터 영역 */}
          <div className="flex-1 overflow-hidden">
            <CustomScrollArea className="h-full">
              <DataTable
                columns={columnsData}
                data={appList}
                isLoading={isLoading}
                onRowClick={handleSelect}
                size="sm"
                height={550}
              />

              {!isLoading && appList.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <p>검색 결과가 없습니다.</p>
                  <p className="text-xs mt-1">출원번호로 검색해 주세요.</p>
                </div>
              )}
            </CustomScrollArea>
          </div>
        </div>
      </FormDialog>
    </FormProvider>
  );
};
