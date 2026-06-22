import { zodResolver } from "@hookform/resolvers/zod";
import { FormDialog, RHF, Separator } from "@repo/ui";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import NationCombo from "pub/NationCombo";
import CostCenterCombo from "pub/CostCenterCombo";
import InvestNationCombo from "pub/InvestNationCombo";

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

export const Modal12 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
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
          <div className="border-border-100 max-h-[calc(100vh-150px)] space-y-2 overflow-auto border-y p-4 px-6">
            <div>
              <div className="border-border-100 bg-bg-50 mb-4 border-b pb-3">
                <h2 className="text-sm font-semibold">사무소 평가내용</h2>
              </div>
            </div>
            <RHF.FormSelect
              control={form.control}
              name="val1"
              items={[
                {
                  value: "test1",
                  label: "테스트 라벨1",
                },
              ]}
              label="신규성"
              orientation="horizontal"
              size="h36"
              defaultValue="test1"
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
              ]}
              label="산업상 이용가능성"
              orientation="horizontal"
              size="h36"
              defaultValue="test1"
              className="[&>h2]:w-30"
            />
            <RHF.FormTextarea
              control={form.control}
              name="val2"
              label="검토결과"
              size="h36"
              orientation="horizontal"
              className="[&>label]:w-30"
            />
            <RHF.MultiFiles
              label="첨부파일"
              className="[&_[data-slot=file-area]]:flex-row [&_[data-slot=file-area]]:text-xs"
              simple
            />

            <div>
              <div className="border-border-100 bg-bg-50 mt-8 mb-4 border-b pb-3">
                <h2 className="text-sm font-semibold">특허부서 평가내용</h2>
              </div>
            </div>

            <RHF.FormSelect
              control={form.control}
              name="val1"
              items={[
                {
                  value: "test1",
                  label: "테스트 라벨1",
                },
              ]}
              label="권리화 필요성"
              orientation="horizontal"
              size="h36"
              defaultValue="test1"
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
              ]}
              label="등록 가능성"
              orientation="horizontal"
              size="h36"
              defaultValue="test1"
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
              ]}
              label="입증 가능성"
              orientation="horizontal"
              size="h36"
              defaultValue="test1"
              className="[&>h2]:w-30"
            />
            <RHF.FormTextarea
              control={form.control}
              name="val2"
              label="검토결과"
              size="h36"
              orientation="horizontal"
              className="[&>label]:w-30"
            />
            <RHF.MultiFiles
              label="첨부파일"
              className="[&_[data-slot=file-area]]:flex-row [&_[data-slot=file-area]]:text-xs"
              simple
            />
            <RHF.FormSelect
              control={form.control}
              name="val1"
              items={[
                {
                  value: "test1",
                  label: "테스트 라벨1",
                },
              ]}
              label="진행방향"
              orientation="horizontal"
              size="h36"
              defaultValue="test1"
              className="[&>h2]:w-30"
            />
          </div>
        </form>
      </FormDialog>
    </FormProvider>
  );
};
