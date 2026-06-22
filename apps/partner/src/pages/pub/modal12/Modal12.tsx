import { data, TestSchema, type TestFormInput } from "../schema";
import {
  Button,
  DataTable,
  FlexBox,
  FormDialog,
  Icons,
  RHF,
  CustomScrollArea,
  Separator,
} from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import { columnsData } from "./columns/columnsData";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FlatTab } from "@shared/ui/tab/ui/Tabs";
import FlatItem from "@shared/ui/tab/ui/FlatItem";

export const Modal12 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
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

  const [modal01, setModal01] = React.useState(false);

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={onSubmit}
        submitText="저장"
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-250!"
      >
        <form className="min-w-0 space-y-4">
          <CustomScrollArea className="h-150">
            <FlexBox vertical className="gap-4 pt-3">
              <div className="w-full">
                <h2 className="pb-1 text-sm font-semibold">사건정보</h2>

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
                    label="사건구분"
                  />

                  <RHF.Input control={form.control} name="testVal" label="OurRef" />
                  <RHF.Input control={form.control} name="testVal" label="YourRef" />
                  <RHF.Input control={form.control} name="testVal" label="출원인 관리번호" />
                  <RHF.Input control={form.control} name="testVal" label="출원번호" />
                  <RHF.Input control={form.control} name="testVal" label="등록번호" />
                </FlexBox>

                <FlexBox className="mt-2">
                  <RHF.Input control={form.control} name="testVal" label="출원명칭" />
                </FlexBox>

                <FlexBox className="mt-2">
                  <RHF.Input control={form.control} name="testVal" label="의뢰인" />
                  <RHF.Input control={form.control} name="testVal" label="출원인" />
                </FlexBox>
              </div>

              <Separator className="border-t" />

              <div className="w-full">
                <h2 className="pb-1 text-sm font-semibold">업무정보</h2>
                <FlexBox className="mb-2">
                  <RHF.FormDatePicker
                    control={form.control}
                    name="testVal"
                    label="분배일"
                    className="w-30"
                    important
                  />

                  <RHF.Input
                    control={form.control}
                    name="testVal"
                    label="분배자"
                    actions={
                      <>
                        <Button className="w-5">
                          <Icons.Search className="size-3" />
                        </Button>
                      </>
                    }
                    className="w-30"
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
                    label="업무구분"
                    className="w-30"
                  />

                  <RHF.Input control={form.control} name="testVal" label="업무내용" />

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
                    label="OA선택"
                  />
                </FlexBox>
                <RHF.Input control={form.control} name="testVal" label="비고" />
              </div>

              <Separator className="border-t" />

              <div className="w-full min-w-0">
                <h2 className="pb-1 text-sm font-semibold">담당자 지정</h2>

                <FlatTab className="border-border-100 mb-2 border-b">
                  <FlexBox className="flex-0">
                    <FlatItem label="담당자" value="담당자" active="담당자" />
                    <FlatItem label="메모" value="메모" active="메모" />
                    <FlatItem label="첨부서류" value="첨부서류" active="첨부서류" />
                    <FlatItem label="현재 담당이력" value="현재 담당이력" active="현재 담당이력" />
                  </FlexBox>

                  <FlexBox className="w-auto flex-none">
                    <RHF.FormCheckbox
                      control={form.control}
                      name="testVal"
                      label="담당자 분배완료"
                      className="mr-4"
                    />
                    <Button size="h24" variant="outline-blue">
                      <Icons.Plus />
                      추가
                    </Button>
                    <Button size="h24">
                      <Icons.PenLine />
                      수정
                    </Button>
                    <Button size="h24">
                      <Icons.Trash />
                      삭제
                    </Button>
                  </FlexBox>
                </FlatTab>

                <DataTable data={data} columns={columnsData} className="h-70 min-w-0" />
              </div>
            </FlexBox>
          </CustomScrollArea>
        </form>
      </FormDialog>
    </FormProvider>
  );
};
