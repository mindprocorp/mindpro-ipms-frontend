import { type TestFormInput, TestSchema } from "../../../pub/schema.ts";
import { Button, CustomScrollArea, FlexBox, FormDialog, Icons, RHF, Separator } from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const Modal11_1 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
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

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={onSubmit}
        submitText="저장"
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-300!"
      >
        <form className="min-w-0 space-y-4">
          <CustomScrollArea className="h-115">
            <FlexBox vertical className="gap-4 pt-3">
              <div className="w-full">
                <h2 className="pb-1 text-sm font-semibold">제출사항</h2>
                <FlexBox>
                  <RHF.Input control={form.control} name="testVal" label="기연" className="w-10" />
                  <RHF.FormDatePicker
                    control={form.control}
                    name="testVal"
                    label="서류마감일"
                    className="w-30"
                    important
                  />
                  <RHF.FormDatePicker
                    control={form.control}
                    name="testVal"
                    label="제출일"
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
                    label="대상"
                    className="w-30"
                  />
                  <RHF.Input control={form.control} name="testVal" label="부서" className="w-30" />
                  <RHF.Input
                    control={form.control}
                    name="testVal"
                    label="제출담당자"
                    actions={
                      <>
                        <Button className="w-5">
                          <Icons.Search className="size-3" />
                        </Button>
                      </>
                    }
                  />
                  <RHF.FormDatePicker
                    control={form.control}
                    name="testVal"
                    label="제출마감일"
                    className="w-30"
                    important
                  />
                  <RHF.FormDatePicker
                    control={form.control}
                    name="testVal"
                    label="제출보고일"
                    className="w-30"
                    important
                  />
                  <RHF.Input
                    control={form.control}
                    name="testVal"
                    label="제출보고담당자"
                    actions={
                      <>
                        <Button className="w-5">
                          <Icons.Search className="size-3" />
                        </Button>
                      </>
                    }
                  />
                </FlexBox>
                <FlexBox className="pt-3">
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
                    label="제출서류"
                  />

                  <RHF.Input control={form.control} name="testVal" label="비고" />
                </FlexBox>
              </div>

              <Separator className="border-t" />

              <div className="w-full">
                <h2 className="pb-1 text-sm font-semibold">첨부서류</h2>
                <FlexBox>
                  <RHF.MultiFiles />
                </FlexBox>
              </div>
            </FlexBox>
          </CustomScrollArea>
        </form>
      </FormDialog>
    </FormProvider>
  );
};
