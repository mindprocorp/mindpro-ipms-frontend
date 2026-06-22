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
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddItem } from "./AddItem";

export const Modal32 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
  const form = useForm<TestFormInput>({
    resolver: zodResolver(TestSchema),
    defaultValues: TestSchema.parse({}),
  });
  const onSubmit = () => {
    console.log("클릭이요");
    onOpenChange(false);
    // onSuccess?.();
  };

  const [addItem, setAddItem] = useState(false);

  const checkOptions = Array.from({ length: 20 }).map((item, index) => {
    return { label: `계류법정 ${index + 1}`, value: `v-${index + 1}` };
  });

  const columns = getColumns<TestData>(columnsData);

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={onSubmit}
        submitText="저장"
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-240!"
      >
        <Separator className="mb-4 border-t" />

        <FlexBox className="">
          <div className="min-w-0">
            <FlexBox className="mb-2">
              <p className="text-sm font-medium">실적</p>
              {/* <div>
                <Button variant="blue">
                  <Icons.Search />
                  검색
                </Button>
              </div> */}
            </FlexBox>
            <DataTable
              data={data}
              columns={columnsData}
              // columnPinning={{ right: ["action"] }}
              size="sm"
              className="h-70"
            />
          </div>

          <FlexBox vertical className="">
            <Button variant="outline" size="h24">
              추가 <Icons.ChevronRight />
            </Button>
            <Button variant="outline" size="h24">
              <Icons.ChevronLeft /> 제외
            </Button>
          </FlexBox>

          <div className="min-w-0">
            <FlexBox className="mb-2 justify-between">
              <p className="text-sm font-medium">실적대상 설정</p>
              <div className="flex gap-1">
                <Button variant="outline" size="h24" onClick={() => setAddItem(true)}>
                  <Icons.Plus />
                  추가
                </Button>

                <Button variant="outline" size="h24">
                  <Icons.Trash />
                  삭제
                </Button>
              </div>
            </FlexBox>
            <DataTable
              data={data}
              columns={columnsData}
              // columnPinning={{ right: ["action"] }}
              size="sm"
              className="h-70"
            />
          </div>
        </FlexBox>
        <AddItem open={addItem} onOpenChange={setAddItem} title="실적분배 등록" />
      </FormDialog>
    </FormProvider>
  );
};
