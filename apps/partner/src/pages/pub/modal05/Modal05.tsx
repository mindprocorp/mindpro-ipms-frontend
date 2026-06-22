import { data, TestSchema, type TestData, type TestFormInput } from "../schema";
import {
  Button,
  DataTable,
  FlexBox,
  FormDialog,
  getColumns,
  GN,
  Icons,
  RHF,
  Separator,
} from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import { columnsData } from "./columns/columnsData";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const Modal05 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
  const form = useForm<TestFormInput>({
    resolver: zodResolver(TestSchema),
    defaultValues: TestSchema.parse({}),
  });
  const onSubmit = () => {
    console.log("클릭이요");
    onOpenChange(false);
    onSuccess?.(undefined);
  };

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={onSubmit}
        submitText="자료복사"
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-250!"
        bodyFull
      >
        <form className="min-w-0">
          <div className="border-border-100 text-text-200 dark:border-input justify-between border-t p-4 text-sm">
            자료복사는 대량건 접수 시 발생되는 과다업무를 해소하기 위한 기능입니다.
            <br />
            복사대상 항목 중 선택하신 항목에 대해서만 복사 됩니다.
            <br />
            참고로, 진행사항 및 아래 탭(연차,갱신,공지예외,연구과제,우선권,요약/청구,전자포대 등) 의
            내용은 복사하지 않습니다.
            <div className="border-border-100 text-text bg-bg-100 dark:bg-background-color dark:border-input mt-5 flex items-center justify-center gap-2 rounded-[6px] border p-4 text-sm dark:text-white">
              현재 자료를 <RHF.Input control={form.control} name="testVal" className="w-12" />건
              복사합니다.
            </div>
          </div>
          <div className="p-6 py-3">
            <RHF.FormCheckboxGroup
              control={form.control}
              name="testVal"
              items={Array.from({ length: 20 }).map((item, index) => {
                return { label: `계류법정 ${index + 1}`, value: `v-${index + 1}` };
              })}
              className="flex-wrap gap-0 [&>div]:w-1/5"
            />
          </div>
        </form>
      </FormDialog>
    </FormProvider>
  );
};
