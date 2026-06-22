import { data, TestSchema, type TestData, type TestFormInput } from "../schema";
import {
  Alert,
  AlertDescription,
  AlertTitle,
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

export const Modal27 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
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
          <RHF.FormDatePicker control={form.control} name="testVal" label="입금일" />

          <FlexBox>
            <RHF.Input control={form.control} name="testVal" label="입금액" />
            <RHF.Input control={form.control} name="testVal" label="입금수수료" />
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
              label="입금방법"
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
              label="은행"
            />
          </FlexBox>

          <Separator className="border-t" />

          <Alert variant="info">
            <Icons.Info />
            <AlertDescription>
              <p className="text-xs">
                입금액(입금액+입금수수료) 금액 중 선수금으로 처리된 금액에 대해서만 입력합니다.
              </p>
            </AlertDescription>
          </Alert>

          <FlexBox className="items-end">
            <RHF.Input
              control={form.control}
              name="testVal"
              label="선수금 입금번호"
              inputDisabled
            />
            <Button className="text-p-color-3! bg-p-color-3/10! hover:bg-p-color-3/16! border-p-color-3! border-l text-xs">
              선수금 조회
            </Button>
          </FlexBox>

          <FlexBox>
            <RHF.Input control={form.control} name="testVal" label="일반선수금 잔액" disabled />
            <RHF.Input control={form.control} name="testVal" label="일반선수금 사용액" disabled />
          </FlexBox>

          <FlexBox>
            <RHF.Input control={form.control} name="testVal" label="지정선수금 잔액" disabled />
            <RHF.Input control={form.control} name="testVal" label="지정선수금 사용액" disabled />
          </FlexBox>

          <RHF.FormTextarea control={form.control} name="testVal" label="비고" />
        </FlexBox>
      </FormDialog>
    </FormProvider>
  );
};
