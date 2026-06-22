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

export const Modal38 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
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
      >
        <FlexBox vertical>
          <FlexBox>
            <RHF.Input
              orientation="horizontal"
              control={form.control}
              name="testVal"
              label="업무구분"
              className="data-[slot=field]:w-56"
            />
            <RHF.FormCheckbox
              control={form.control}
              name="testVal"
              label="e-Tex 담당자"
              size="sm"
              // className="ml-auto"
            />
          </FlexBox>

          <FlexBox>
            <RHF.Input control={form.control} name="testVal" label="담당자" />
            <RHF.Input control={form.control} name="testVal" label="휴대폰" />
          </FlexBox>

          <FlexBox>
            <RHF.Input control={form.control} name="testVal" label="부서" />
            <RHF.Input control={form.control} name="testVal" label="전화" />
          </FlexBox>

          <FlexBox>
            <RHF.Input control={form.control} name="testVal" label="직책" />
            <RHF.Input control={form.control} name="testVal" label="팩스" />
          </FlexBox>

          <RHF.Input control={form.control} name="testVal" label="이메일" />

          <FlexBox className="items-end">
            <RHF.Input
              control={form.control}
              name="testVal"
              label="우편번호"
              className="data-[slot=field]:w-30"
              disabled
            />
            <Button>우편번호검색</Button>
          </FlexBox>
          <RHF.Input control={form.control} name="testVal" label="주소" />
          <RHF.Input control={form.control} name="testVal" label="상세주소" noSpace={false} />
          <RHF.FormTextarea control={form.control} name="testVal" label="메모" />
        </FlexBox>
      </FormDialog>
    </FormProvider>
  );
};
