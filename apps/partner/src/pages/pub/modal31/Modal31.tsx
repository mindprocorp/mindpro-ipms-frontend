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

export const Modal31 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
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
        className="max-w-200!"
      >
        <FlexBox>
          <FlexBox vertical>
            <FlexBox>
              <RHF.FormDatePicker control={form.control} name="testVal" label="입금일" />
              <RHF.Input control={form.control} name="testVal" label="수수료" />
            </FlexBox>

            <FlexBox>
              <RHF.Input control={form.control} name="testVal" label="부가세" />
              <RHF.Input control={form.control} name="testVal" label="합계" important />
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

            <RHF.FormTextarea control={form.control} name="testVal" label="비고" />

            <Separator className="border-t" />

            <FlexBox>
              <h2>사업자등록정보(세금계산서 발행용)</h2>
              <Button className="text-p-color-3! bg-p-color-3/10! hover:bg-p-color-3/16! border-p-color-3! border-l text-xs">
                전자세금
              </Button>
            </FlexBox>

            <RHF.Input control={form.control} name="testVal" label="상호" />

            <FlexBox>
              <RHF.FormDatePicker control={form.control} name="testVal" label="계산서 발행일" />
              <RHF.Input control={form.control} name="testVal" label="발행번호" />
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
                label="발행구분"
              />
              <RHF.FormDatePicker control={form.control} name="testVal" label="계산서 송부일" />
            </FlexBox>

            <RHF.Input control={form.control} name="testVal" label="사업장" />

            <FlexBox>
              <RHF.Input control={form.control} name="testVal" label="업태" />
              <RHF.Input control={form.control} name="testVal" label="종목" />
            </FlexBox>

            <RHF.Input control={form.control} name="testVal" label="이메일" />

            <FlexBox>
              <RHF.Input control={form.control} name="testVal" label="담당자" />
              <RHF.Input control={form.control} name="testVal" label="부서" />
            </FlexBox>
          </FlexBox>
          <FlexBox>
            <div className="w-full border">
              추후논의(지정사건 셀렉트가 있으나 무슨의미인지 확인 필요)
            </div>
          </FlexBox>
        </FlexBox>
      </FormDialog>
    </FormProvider>
  );
};
