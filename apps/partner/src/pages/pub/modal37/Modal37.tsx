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
import { AddItem } from "./AddItem";

export const Modal37 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
  const form = useForm<TestFormInput>({
    resolver: zodResolver(TestSchema),
    defaultValues: TestSchema.parse({}),
  });
  const onSubmit = () => {
    console.log("클릭이요");
    onOpenChange(false);
    // onSuccess?.();
  };

  const [addItem, setAddItem] = useState(false);

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
        // className="max-w-240!"
      >
        <FlexBox vertical>
          <FlexBox>
            <RHF.Input
              control={form.control}
              name="testVal"
              label="변리사명"
              actions={
                <>
                  <Button className="w-5">
                    <Icons.Search className="size-3" />
                  </Button>
                </>
              }
            />

            <RHF.Input control={form.control} name="testVal" label="지정변리사" />
          </FlexBox>

          <FlexBox>
            <RHF.Input control={form.control} name="testVal" label="대리인번호" disabled />
            <RHF.FormDatePicker control={form.control} name="testVal" label="위임일" />
          </FlexBox>
          <FlexBox>
            <RHF.Input control={form.control} name="testVal" label="위임번호" />
            <RHF.Input control={form.control} name="testVal" label="위임범위" />
          </FlexBox>
          <RHF.Input control={form.control} name="testVal" label="고객특허번호" />

          <RHF.FormTextarea control={form.control} name="testVal" label="메모" />
        </FlexBox>
      </FormDialog>
    </FormProvider>
  );
};
