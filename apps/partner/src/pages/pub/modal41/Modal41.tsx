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
import { columnsData } from "./columns/columnsData";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddItem } from "./AddItem";

export const Modal41 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
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

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={onSubmit}
        submitText="저장"
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-240!"
      >
        <FlexBox vertical>
          <FlexBox>
            <RHF.Input control={form.control} name="testVal" label="고안자(한글)" />
            <RHF.Input control={form.control} name="testVal" label="고안자(영문)" />
            <RHF.Input control={form.control} name="testVal" label="고안자(한문)" />
            <RHF.Input control={form.control} name="testVal" label="고안자(일문)" />
            <RHF.Input control={form.control} name="testVal" label="국적" />
            <RHF.Input control={form.control} name="testVal" label="주민번호" />
          </FlexBox>

          <FlexBox vertical>
            <RHF.Input
              control={form.control}
              name="testVal"
              label="주소(한글)"
              orientation="horizontal"
            />
            <RHF.Input
              control={form.control}
              name="testVal"
              label="주소(영문)"
              orientation="horizontal"
            />
            <RHF.Input
              control={form.control}
              name="testVal"
              label="주소(한문)"
              orientation="horizontal"
            />
            <RHF.Input
              control={form.control}
              name="testVal"
              label="주소(일문)"
              orientation="horizontal"
            />
          </FlexBox>

          <RHF.FormTextarea control={form.control} name="testVal" label="비고" />
        </FlexBox>

        <Separator className="mb-4 border-t" />

        <div className="border-border-100 dark:border-input flex items-center gap-1 border-t py-3">
          <p className="text-text-200 text-xs">고안자을(를) 추가 버튼을 클릭해 추가해주세요</p>

          <Button variant="outline" size="h24" className="ml-auto" onClick={() => setAddItem(true)}>
            추가
          </Button>
          <Button variant="outline" size="h24" className="" onClick={() => setAddItem(true)}>
            수정
          </Button>

          <Button variant="outline" size="h24" className="" onClick={() => setAddItem(true)}>
            삭제
          </Button>
        </div>

        <InfiniteDataTable
          data={data}
          columns={columnsData}
          // columnPinning={{ right: ["action"] }}
          size="sm"
          className="h-70"
        />

        <AddItem open={addItem} onOpenChange={setAddItem} title="고안자 목록" />
      </FormDialog>
    </FormProvider>
  );
};
