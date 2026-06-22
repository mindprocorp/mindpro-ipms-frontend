import { data, TestSchema, type TestFormInput } from "../schema";
import { Button, DataTable, FlexBox, FormDialog } from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import { columnsData } from "./columns/columnsData";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FlatItem from "@shared/ui/tab/ui/FlatItem";
import { FlatTab } from "@shared/ui/tab/ui/Tabs";

export const Modal09 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
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
        submitText="확인"
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-250!"
        bodyFull
      >
        <FlatTab className="border-border-100 mb-2 border-y px-3 pt-2">
          <FlexBox>
            <FlatItem label="국내출원" value="국내출원" active="국내출원" />
            <FlatItem label="해외출원" value="국외출원" />
            <FlatItem label="이의심판" value="국외출원" />
            <FlatItem label="기타사건" value="국외출원" />
            <FlatItem label="미수금" value="국외출원" />
            <FlatItem label="청구서" value="국외출원" />
          </FlexBox>

          <Button>엑셀</Button>
        </FlatTab>

        <FlexBox className="justify-between px-3 py-2">
          <p className="text-text-200 text-sm">
            총 <span className="text-p-color-1 font-bold">100</span>건의 결과가 있습니다.
          </p>
        </FlexBox>

        <DataTable
          data={data}
          columns={columnsData}
          // columnPinning={{ left: ["select", "email", "id"] }}
          className="h-70"
        />
      </FormDialog>
    </FormProvider>
  );
};
