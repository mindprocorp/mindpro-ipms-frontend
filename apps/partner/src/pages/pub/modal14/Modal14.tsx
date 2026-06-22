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

export const Modal14 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
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
        submitText="저장"
        open={open}
        onOpenChange={onOpenChange}
      >
        <FlexBox vertical>
          <FlexBox>
            <RHF.Input control={form.control} name="testVal" label="분류코드" ess />
            <RHF.Input control={form.control} name="testVal" label="코드명" ess />
          </FlexBox>
          <FlexBox>
            <RHF.FormDatePicker control={form.control} name="testVal" label="시작일" ess />
            <RHF.FormDatePicker control={form.control} name="testVal" label="종료일" ess />
          </FlexBox>
          <FlexBox vertical>
            <RHF.FormSelect
              control={form.control}
              name="testVal"
              items={[
                { label: "마감경과", value: "" },
                { label: "미출원", value: "" },
                { label: "심사미청구", value: "" },
                { label: "OV/심판", value: "" },
                { label: "등록료마감", value: "" },
                { label: "연차마감", value: "" },
                { label: "갱신마감", value: "" },
              ]}
              label="변경여부"
              ess
            />
            <RHF.FormTextarea control={form.control} name="testVal" label="비고" />
          </FlexBox>
        </FlexBox>
      </FormDialog>
    </FormProvider>
  );
};
