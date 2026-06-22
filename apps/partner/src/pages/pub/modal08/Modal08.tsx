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

export const Modal08 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
  const form = useForm<TestFormInput>({
    resolver: zodResolver(TestSchema),
    defaultValues: TestSchema.parse({}),
  });
  const onSubmit = () => {
    console.log("클릭이요");
    onOpenChange(false);
    onSuccess?.(undefined);
  };

  const checkOptions = Array.from({ length: 20 }).map((item, index) => {
    return { label: `계류법정 ${index + 1}`, value: `v-${index + 1}` };
  });

  const columns = getColumns<TestData>(columnsData);

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={onSubmit}
        submitText="확인"
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-150!"
      >
        <form className="min-w-0 space-y-4">
          <RHF.FormField className="mt-4 [&>div]:gap-2">
            <RHF.Input control={form.control} name="testVal" label="거래명세서 발행번호" />
            <RHF.Input control={form.control} name="testVal" label="전자비고" />
          </RHF.FormField>

          <RHF.FormTextarea control={form.control} name="testVal" label="내용" />
        </form>
      </FormDialog>
    </FormProvider>
  );
};
