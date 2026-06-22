import { data, TestSchema, type TestFormInput } from "../schema";
import { Button, DataTable, FlexBox, FormDialog, RHF, Separator } from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import { columnsData } from "./columns/columnsData";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Table } from "./Table";

export const Modal06 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
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
        submitText="자료복사"
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-280!"
        bodyFull
      >
        <form className="min-w-0 space-y-4">
          <RHF.FormField gap={2} className="border-border-100 dark:border-input border-t p-3">
            <RHF.FormSelect
              control={form.control}
              name="testVal"
              items={[
                {
                  value: "next.js",
                  label: "Next.js",
                },
                {
                  value: "sveltekit",
                  label: "SvelteKit",
                },
              ]}
              className="w-30"
            />
            <div className="w-60">
              <RHF.FormDateFromToPicker
                control={form.control}
                name={[`testVal`, `testVal`]}
                // label="선택"
              />
            </div>

            <RHF.FormCheckboxGroup
              control={form.control}
              name="testVal"
              items={[
                { label: "세금계산서", value: "001" },
                { label: "수정계산서", value: "002" },
                { label: "거래명세서", value: "003" },
                { label: "페기,삭제포함", value: "004" },
              ]}
              className="[&>div]:min-h-7"
              size="sm"
            />

            <RHF.FormSelect
              control={form.control}
              name="testVal"
              items={[
                {
                  value: "next.js",
                  label: "Next.js",
                },
                {
                  value: "sveltekit",
                  label: "SvelteKit",
                },
              ]}
              className="ml-6 w-26"
            />
            <RHF.Input control={form.control} name="testVal" className="w-44" />
            <Button size="h28" variant="blue">
              검색
            </Button>
          </RHF.FormField>
        </form>
        <FlexBox className="p-3 pt-0 [&>div]:w-full">
          <div className="border-border-100 dark:border-input overflow-hidden rounded-sm border [&>h2]:text-xs [&>h2]:font-semibold">
            <h2 className="border-border-100 bg-bg-100 dark:bg-background-color dark:border-input border-b p-2">
              11월 매출세금계산서현황 미결현황
            </h2>
            <Table />
            <h2 className="bg-info-bg border-border-100 text-p-color-1 dark:bg-background-color dark:border-input border-y p-2">
              국세청 전송 기준
            </h2>
            <Table />
          </div>

          <div className="border-border-100 dark:border-input overflow-hidden rounded-sm border [&>h2]:text-xs [&>h2]:font-semibold">
            <h2 className="border-border-100 bg-bg-100 dark:bg-background-color dark:border-input border-b p-2">
              11월 매출세금계산서현황 미결현황
            </h2>
            <Table />
            <h2 className="bg-info-bg border-border-100 text-p-color-1 dark:bg-background-color dark:border-input border-y p-2">
              국세청 전송 기준
            </h2>
            <Table />
          </div>
        </FlexBox>

        <Separator className="mt-1 mb-4 border-t" />

        <FlexBox className="justify-between px-3 pb-2">
          <p className="text-text-200 text-sm">
            총 <span className="text-p-color-1 font-bold">100</span>건의 결과가 있습니다.
          </p>
          <FlexBox className="flex-0 gap-1">
            <Button size="h24">메일 미수신</Button>
            <Button size="h24">미승인</Button>
            <Button size="h24">반려</Button>
            <Button size="h24">전송오류</Button>
            <Button size="h24">미전송</Button>
            <Button size="h24">국세청 전송</Button>
            <Button size="h24">패기</Button>
            <Button size="h24">수정세금계산서발행</Button>
            <Button size="h24">메일재전송(메일변경)</Button>
            <Button size="h24">인쇄</Button>
            <Button size="h24">엑셀변환</Button>
          </FlexBox>
        </FlexBox>

        <DataTable
          data={data}
          columns={columnsData}
          columnPinning={{ left: ["email", "id"] }}
          height={250}
        />
        <RHF.FormField
          label="합계"
          className="bg-p-color-2/5 border-border-100 [&>label]:text-text dark:bg-p-color-2/10 flex-row justify-between border-b px-4 py-2 dark:[&>label]:text-white"
        >
          <RHF.Input control={form.control} name="testVal" label="건수" orientation="horizontal" />
          <RHF.Input
            control={form.control}
            name="testVal"
            label="공급가"
            orientation="horizontal"
          />
          <RHF.Input
            control={form.control}
            name="testVal"
            label="부가세"
            orientation="horizontal"
          />
          <RHF.Input control={form.control} name="testVal" label="합계" orientation="horizontal" />
        </RHF.FormField>
      </FormDialog>
    </FormProvider>
  );
};
