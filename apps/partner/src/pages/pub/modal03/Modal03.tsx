import { data, TestSchema, type TestFormInput } from "../schema";
import { Button, DataTable, FlexBox, FormDialog, Icons } from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import { columnsData } from "./columns/columnsData";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const Modal03 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
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
      >
        <FlexBox className="border-border-100 dark:border-input justify-between border-t px-3 py-2">
          <div></div>
          <Button variant="outline-green">
            <Icons.FileText />
            엑셀
          </Button>
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
