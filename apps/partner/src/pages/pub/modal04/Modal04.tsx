import { data, TestSchema, type TestFormInput } from "../schema";
import { Button, DataTable, FlexBox, FormDialog, Icons } from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import { columnsData } from "./columns/columnsData";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const Modal04 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
  const form = useForm<TestFormInput>({
    resolver: zodResolver(TestSchema),
    defaultValues: TestSchema.parse({}),
  });
  const onSubmit = () => {
    console.log("클릭이요");
    onOpenChange(false);
    onSuccess?.(undefined);
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
        description="※  테이블에서 “사건구문(또는 OurRef)” 클릭시 사건 상세화면이 오픈됩니다."
      >
        <FlexBox className="border-border-100 bg-bg-100 dark:bg-background-color dark:border-input justify-between border-t px-3 py-2">
          <h2 className="text-sm font-bold">관련사건(자동)</h2>
          <Button variant="outline-green">
            <Icons.FileText />
            엑셀
          </Button>
        </FlexBox>
        <DataTable
          data={data}
          columns={columnsData}
          // columnPinning={{ left: ["email", "id"] }}
          height={300}
        />

        <FlexBox className="border-border-100 bg-bg-100 dark:bg-background-color dark:border-input justify-between border-t px-3 py-2">
          <h2 className="text-sm font-bold">관련사건(입력)</h2>
          <Button variant="outline-green">
            <Icons.FileText />
            엑셀
          </Button>
        </FlexBox>
        <DataTable
          data={data}
          columns={columnsData}
          columnPinning={{ left: ["email", "id"] }}
          height={300}
          size="sm"
        />
      </FormDialog>
    </FormProvider>
  );
};
