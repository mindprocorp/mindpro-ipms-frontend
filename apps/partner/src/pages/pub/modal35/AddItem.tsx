import { data, TestSchema, type TestData, type TestFormInput } from "../schema";
import {
  Button,
  InfiniteDataTable,
  FlexBox,
  FormDialog,
  getColumns,
  GN,
  Icons,
  RHF,
  Separator,
} from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import { addColumns } from "./columns/addColumns";
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

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={onSubmit}
        submitText="저장"
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-150!"
      >
        <div className="border-border-100 dark:border-input flex gap-1 border-t py-3">
          <RHF.Input
            control={form.control}
            name="testVal"
            // label="등록권리자 검색"
            orientation="horizontal"
          />
          <Button variant="blue">
            <Icons.Search />
            검색
          </Button>
        </div>

        <InfiniteDataTable
          data={data}
          columns={addColumns}
          // columnPinning={{ right: ["action"] }}
          size="sm"
          className="h-70"
        />
      </FormDialog>
    </FormProvider>
  );
};
