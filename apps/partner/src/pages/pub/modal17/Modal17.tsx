import { data, TestSchema, type TestData, type TestFormInput } from "../schema";
import {
  Button,
  Calendar,
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
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type CalendarItem = { id: string; title: string };
type CalendarData = Record<string, CalendarItem[]>;
const calendarData: CalendarData = {
  "2026-01-23": [
    { id: "1", title: "회의" },
    { id: "2", title: "병원" },
  ],
};

export const Modal17 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
  const form = useForm<TestFormInput>({
    resolver: zodResolver(TestSchema),
    defaultValues: TestSchema.parse({}),
  });
  const onSubmit = () => {
    console.log("클릭이요");
    onOpenChange(false);
    onSuccess?.(undefined);
  };

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={onSubmit}
        submitText="추가"
        open={open}
        onOpenChange={onOpenChange}
      >
        <FlexBox>
          <RHF.Input
            control={form.control}
            name="testVal"
            label="국가코드 또는 국가명"
            placeholder="추가할 국가코드(또는 국가명)을 입력해주세요"
            ess
          />
        </FlexBox>
      </FormDialog>
    </FormProvider>
  );
};
