import { data, TestSchema, type TestFormInput } from "../schema";
import { DataTable, FlexBox, FormDialog, RHF } from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import { columnsData } from "./columns/columnsData";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const Modal02 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
  const form = useForm<TestFormInput>({
    resolver: zodResolver(TestSchema),
    defaultValues: TestSchema.parse({}),
  });
  const onSubmit = () => {
    console.log("클릭이요");
    onOpenChange(false);
    onSuccess?.(undefined);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  };

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={onSubmit}
        submitText="확인"
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-250!"
        bodyFull
      >
        <form className="min-w-0 space-y-4">
          <RHF.FormField gap={2} className="border-border-100 dark:border-input border-t p-3">
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
              className="w-50"
            />
            <RHF.Input control={form.control} name="testVal" />
          </RHF.FormField>
        </form>
        <FlexBox className="px-3 pb-2">
          <p className="text-text-200 text-sm">
            총 <span className="text-p-color-1 font-bold">100</span>건의 결과가 있습니다.
          </p>
        </FlexBox>
        <DataTable
          data={data}
          columns={columnsData}
          columnPinning={{ left: ["email", "id"] }}
          height={400}
        />
      </FormDialog>
    </FormProvider>
  );
};
