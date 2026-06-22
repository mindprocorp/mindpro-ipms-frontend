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
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const AddItem = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
  const form = useForm<TestFormInput>({
    resolver: zodResolver(TestSchema),
    defaultValues: TestSchema.parse({}),
  });
  const onSubmit = () => {
    console.log("클릭이요");
    onOpenChange(false);
    // onSuccess?.();
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
        submitText="저장"
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-100!"
      >
        <FlexBox vertical>
          <FlexBox>
            <RHF.Input control={form.control} name="testVal" label="담당자" />

            <RHF.FormSelect
              control={form.control}
              name="testVal"
              items={[
                {
                  value: "next.js",
                  label: "Next.js",
                },
                {
                  value: "sveltekit",
                  label: "SvelteKit",
                },
              ]}
              label="부서"
            />
          </FlexBox>

          <FlexBox>
            <RHF.FormSelect
              control={form.control}
              name="testVal"
              items={[
                {
                  value: "next.js",
                  label: "Next.js",
                },
                {
                  value: "sveltekit",
                  label: "SvelteKit",
                },
              ]}
              label="실적구분"
            />

            <RHF.Input control={form.control} name="testVal" label="기여율(%)" />
          </FlexBox>

          <FlexBox>
            <RHF.FormDatePicker control={form.control} name="testVal" label="실적인정일자" />
            <RHF.Input control={form.control} name="testVal" label="실적" />
          </FlexBox>

          <RHF.FormTextarea control={form.control} name="testVal" label="비고" />
        </FlexBox>
      </FormDialog>
    </FormProvider>
  );
};
