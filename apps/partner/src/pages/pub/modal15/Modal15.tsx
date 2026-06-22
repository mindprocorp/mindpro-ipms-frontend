import { TestSchema, type TestData, type TestFormInput } from "../schema";
import { Button, DataTable, DndDataTable, FormDialog, getColumns, Icons, RHF } from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import { columnsData } from "./columns/columnsData";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

export const Modal15 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
  const form = useForm<TestFormInput>({
    resolver: zodResolver(TestSchema),
    defaultValues: TestSchema.parse({}),
  });
  const onSubmit = () => {
    console.log("클릭이요");
    onOpenChange(false);
    onSuccess?.(undefined);
  };

  const datas = Array.from({ length: 10 }).map((item, index) => ({
    id: `m5gr84i9-${index}`,
    nameKo: `한글이름-${index}`,
    nameEn: `영문이름-${index}`,
    cusNum: `고객번호-${index}`,
    rate: `지분율-${index}`,
    note: `비고-${index}`,
    seq: index,
  }));

  const columns = getColumns<TestData>(columnsData);
  const [data, setData] = useState(datas);

  // console.log(data);

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
        <div className="border-border-100 dark:border-input flex gap-1 border-t p-3">
          <RHF.Input
            control={form.control}
            name="testVal"
            label="등록권리자 검색"
            orientation="horizontal"
          />
          <Button variant="blue">
            <Icons.Search />
            검색
          </Button>
        </div>

        <div className="border-border-100 bg-bg-50 dark:bg-background-color dark:border-input flex items-center justify-between gap-1 border-t p-3">
          <div className="text-text-200 text-xs">
            상세버튼을 클릭해 해당 내용을 수정하실 수 있습니다.
          </div>
          <div className="flex gap-1">
            <Button size="h24" variant="outline-blue">
              <Icons.CloudUpload />
              저장
            </Button>
            <Button size="h24">
              <Icons.Trash2 />
              삭제
            </Button>
          </div>
        </div>
        <DndDataTable
          data={data}
          setData={setData}
          columns={columns}
          className="h-70"
          // columnPinning={{ left: ["drag"] }}
        />
      </FormDialog>
    </FormProvider>
  );
};
