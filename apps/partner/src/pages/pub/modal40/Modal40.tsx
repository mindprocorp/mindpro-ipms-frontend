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
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const Modal40 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
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

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={onSubmit}
        submitText="저장"
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-180!"
      >
        <FlexBox vertical>
          <FlexBox>
            <RHF.FormDatePicker control={form.control} name="testVal" label="변경일" />
            <RHF.Input control={form.control} name="testVal" label="변경항목" />
          </FlexBox>

          <FlexBox>
            <RHF.FormTextarea control={form.control} name="testVal" label="변경전" />
            <div className="pt-5">
              <Icons.ArrowRight className="size-4" />
            </div>
            <RHF.FormTextarea control={form.control} name="testVal" label="변경후" />
          </FlexBox>
        </FlexBox>
      </FormDialog>
    </FormProvider>
  );
};
