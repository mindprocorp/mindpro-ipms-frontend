import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { Button, CustomTooltip, FlexBox, RHF, Separator } from "@repo/ui";
import React from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const Test2Schema = z.object({
  testVal: z
    .string()
    .min(2, {
      message: "필수입력",
    })
    .default(""),
});

export type TestFormInput2 = z.input<typeof Test2Schema>;

export const EtcModal = (type: string) => {
  const form = useForm<TestFormInput2>({
    resolver: zodResolver(Test2Schema),
    defaultValues: Test2Schema.parse({}),
  });

  return (
    <form className="min-w-0 space-y-4">
      <RHF.FormField gap={2} className="border-border-100 dark:border-input border-t p-3">
        <RHF.FormSelect
          control={form.control}
          name="testVal"
          items={[
            {
              value: "개국-특허",
              label: "개국-특허",
            },
            {
              value: "개국-디자인",
              label: "개국-디자인",
            },
            {
              value: "개국-상표",
              label: "개국-상표",
            },
            {
              value: "EP",
              label: "EP",
            },
            {
              value: "PCT",
              label: "PCT",
            },
          ]}
          className="w-50"
        />
      </RHF.FormField>
    </form>
  );
};