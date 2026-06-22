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

export const Modal13 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
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
            <RHF.Input
              control={form.control}
              name="testVal"
              label="담당자"
              actions={
                <>
                  <Button className="w-5">
                    <Icons.Search className="size-3" />
                  </Button>
                </>
              }
            />

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
          <RHF.Input control={form.control} name="testVal" label="담당자 업무" />
          <FlexBox>
            <RHF.Input control={form.control} name="testVal" label="기여율(%)" />
            <RHF.FormDatePicker control={form.control} name="testVal" label="확인일" />
          </FlexBox>
          <FlexBox>
            <RHF.FormDatePicker
              control={form.control}
              name="testVal"
              label="임의마감일"
              important
            />
            <RHF.FormDatePicker control={form.control} name="testVal" label="작성일" />
          </FlexBox>
          <FlexBox>
            <RHF.FormDatePicker control={form.control} name="testVal" label="마감일" important />
            <RHF.FormDatePicker control={form.control} name="testVal" label="완료일" />
          </FlexBox>

          <RHF.FormTextarea control={form.control} name="testVal" label="비고" />
        </FlexBox>
      </FormDialog>
    </FormProvider>
  );
};
