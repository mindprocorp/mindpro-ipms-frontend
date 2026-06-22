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

export const Modal33 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
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
            <RHF.Input control={form.control} name="testVal" label="의뢰인(한글)" disabled />
            <RHF.Input control={form.control} name="testVal" label="의뢰인(영문)" disabled />
            <RHF.Input control={form.control} name="testVal" label="특허고객번호" disabled />
          </FlexBox>

          <RHF.FormTextarea control={form.control} name="testVal" label="비고" />
        </FlexBox>

        <div className="border-border-100 dark:border-input flex items-center gap-1 border-t py-3">
          <Button variant="outline" size="h24" className="ml-auto" onClick={() => setAddItem(true)}>
            저장
          </Button>
        </div>

        <Separator className="mb-4 border-t" />

        <div className="border-border-100 dark:border-input flex items-center gap-1 border-t py-3">
          <p className="text-text-200 text-xs">
            의뢰인 추가하기 버튼을 클릭해 의뢰인을 추가해주세요
          </p>
          <Button variant="outline" size="h24" className="ml-auto" onClick={() => setAddItem(true)}>
            선택삭제
          </Button>

          <Button variant="outline" size="h24" className="" onClick={() => setAddItem(true)}>
            의뢰인 추가
          </Button>
        </div>

        <InfiniteDataTable
          data={data}
          columns={columnsData}
          // columnPinning={{ right: ["action"] }}
          size="sm"
          className="h-70"
        />
        <AddItem open={addItem} onOpenChange={setAddItem} title="의뢰인 목록" />
      </FormDialog>
    </FormProvider>
  );
};
