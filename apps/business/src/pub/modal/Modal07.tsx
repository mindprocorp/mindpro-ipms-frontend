import { zodResolver } from "@hookform/resolvers/zod";
import { FormDialog, RHF } from "@repo/ui";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import NationCombo from "pub/NationCombo";

type ModalProps = {
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (rtnData: any) => void;
};

const TestSchema = z.object({
  val1: z.string().default(""),
  val2: z.string().min(1, { message: "sdf" }).default(""),
  val3: z.string().default(""),
});

type TestInput = z.input<typeof TestSchema>;
type TestOutput = z.input<typeof TestSchema>;

export const Modal07 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
  const form = useForm<TestInput>({
    resolver: zodResolver(TestSchema),
    defaultValues: TestSchema.parse({}),
  });

  const onSubmit = (values: TestInput) => {
    const resultValue: TestOutput = TestSchema.parse(values);
    form.reset();
    onOpenChange(false);
    onSuccess?.(resultValue);
  };

  useEffect(() => {
    form.setValue("val1", "test1");
  }, []);

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={form.handleSubmit(onSubmit)}
        open={open}
        onOpenChange={onOpenChange}
        submitText="확인"
        className="max-w-120!"
        bodyFull
      >
        <form className="min-w-0 space-y-4">
          <div className="border-border-100 space-y-4 border-y p-4 px-6">
            <NationCombo
              control={form.control}
              name="val1"
              items={[
                {
                  value: "test1",
                  label: "테스트 라벨1",
                },
                {
                  value: "test2",
                  label: "테스트 라벨2",
                },
              ]}
              label="국가"
              size="h36"
              ess
            />

            <RHF.Input control={form.control} name="val2" label="문원번호" size="h36" ess />

            <RHF.FormDatePicker control={form.control} name="val2" label="출원일" size="h36" />

            <RHF.Input control={form.control} name="val2" label="출원인명" size="h36" />

            <RHF.Input control={form.control} name="val2" label="발명의 명칭" size="h36" />

            <RHF.MultiFiles
              label="첨부파일"
              className="[&_[data-slot=file-area]]:flex-row [&_[data-slot=file-area]]:text-xs"
              simple
            />
          </div>
        </form>
      </FormDialog>
    </FormProvider>
  );
};
