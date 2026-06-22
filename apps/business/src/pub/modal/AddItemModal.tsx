import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, DataTable, FormDialog, Icons, RHF } from "@repo/ui";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

type ModalProps = {
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (rtnData: any) => void;
};

const TestSchema = z.object({
  val1: z.string().default(""),
  val2: z.string().default(""),
  val3: z.string().default(""),
});

type TestInput = z.input<typeof TestSchema>;
type TestOutput = z.input<typeof TestSchema>;

type ListType = {
  id: string;
  classfn: string;
  title: string;
  Ipt: string;
  status: string;
};

const data: ListType[] = [
  {
    id: "0000000063",
    classfn: "R1-C0020",
    title: "출원테스트 요청",
    Ipt: "A",
    status: "조사의뢰검토",
  },
  {
    id: "0000000069",
    classfn: "R1-C0020",
    title: "출원테스트 요청",
    Ipt: "S",
    status: "조사의뢰검토",
  },
];

export const AddItemModal = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
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
            <RHF.Input control={form.control} name="val2" label="문원번호" size="h36" ess />

            <RHF.FormDatePicker control={form.control} name="val2" label="출원일" size="h36" />

            <RHF.Input control={form.control} name="val2" label="출원인명" size="h36" />

            <RHF.Input control={form.control} name="val2" label="발명의 명칭" size="h36" />
          </div>
        </form>
      </FormDialog>
    </FormProvider>
  );
};
