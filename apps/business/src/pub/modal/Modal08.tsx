import { zodResolver } from "@hookform/resolvers/zod";
import { FormDialog, RHF } from "@repo/ui";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";

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

export const Modal08 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
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
        submitText="저장"
        className="max-w-100!"
        bodyFull
      >
        <form className="min-w-0 space-y-3">
          <div className="border-border-100 space-y-2 border-y p-4 px-6">
            <RHF.FormSelect
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
              label="구분"
              orientation="horizontal"
              size="h36"
              defaultValue="test1"
              className="[&>h2]:w-25"
            />

            <RHF.Input
              control={form.control}
              name="val2"
              label="고객사 명"
              size="h36"
              orientation="horizontal"
              className="[&>label]:w-25"
              ess
            />
            <RHF.Input
              control={form.control}
              name="val2"
              label="투자금액(억원)"
              size="h36"
              orientation="horizontal"
              align="right"
              className="[&>label]:w-25"
              ess
            />
            <RHF.Input
              control={form.control}
              name="val2"
              label="매출금액(억원)"
              size="h36"
              orientation="horizontal"
              align="right"
              className="[&>label]:w-25"
              ess
            />
          </div>
        </form>
      </FormDialog>
    </FormProvider>
  );
};
