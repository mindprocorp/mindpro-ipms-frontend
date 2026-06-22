import { zodResolver } from "@hookform/resolvers/zod";
import { FormDialog, RHF, Separator } from "@repo/ui";
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

export const Modal09 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
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
        className="max-w-140!"
        bodyFull
      >
        <form className="min-w-0 space-y-2">
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
              label="권리구분"
              orientation="horizontal"
              size="h36"
              defaultValue="test1"
              className="[&>h2]:w-30"
            />

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
              orientation="horizontal"
              className="[&>h2]:w-30"
              size="h36"
              ess
            />

            <RHF.Input
              control={form.control}
              name="val2"
              label="최종인용번호"
              size="h36"
              orientation="horizontal"
              className="[&>label]:w-30"
              ess
            />

            <RHF.Input
              control={form.control}
              name="val2"
              label="발명의 명칭"
              size="h36"
              orientation="horizontal"
              className="[&>label]:w-30"
              ess
            />

            <RHF.FormDatePicker
              control={form.control}
              name="val2"
              label="출원일"
              size="h36"
              orientation="horizontal"
              className="[&>h2]:w-30"
            />

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
              label="인용특허현재 상태"
              orientation="horizontal"
              size="h36"
              defaultValue="test1"
              className="[&>h2]:w-30"
            />

            <RHF.Input
              control={form.control}
              name="val2"
              label="청구항번호"
              size="h36"
              orientation="horizontal"
              className="[&>label]:w-30"
              ess
            />

            <Separator className="my-2 mt-4 border-t" />

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
