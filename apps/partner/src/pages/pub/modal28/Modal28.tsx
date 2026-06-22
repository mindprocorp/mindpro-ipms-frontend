import { data, TestSchema, type TestData, type TestFormInput } from "../schema";
import {
  Button,
  DataTable,
  FlexBox,
  FormDialog,
  getColumns,
  GN,
  Icons,
  RHF,
  Separator,
} from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import { columnsData } from "./columns/columnsData";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FlatTab } from "@shared/ui/tab/ui/Tabs";
import FlatItem from "@shared/ui/tab/ui/FlatItem";

export const Modal28 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
  const form = useForm<TestFormInput>({
    resolver: zodResolver(TestSchema),
    defaultValues: TestSchema.parse({}),
  });
  const onSubmit = () => {
    console.log("클릭이요");
    onOpenChange(false);
    // onSuccess?.();
  };

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={onSubmit}
        submitText="저장"
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-200!"
        bodyFull
      >
        <FlatTab className="border-border-100 mb-2 border-y px-3 pt-2">
          <FlexBox>
            <FlatItem label="일반선수금" value="일반선수금" active="일반선수금" />
            <FlatItem label="지정선수금" value="지정선수금" />
          </FlexBox>

          <GN.CheckBox size="sm" name="zero" label="잔액이 0인것도 포함" />
        </FlatTab>

        <DataTable
          data={data}
          columns={columnsData}
          // columnPinning={{ right: ["action"] }}
          enableMultiRowSelection={false}
          className="h-70"
        />
      </FormDialog>
    </FormProvider>
  );
};
