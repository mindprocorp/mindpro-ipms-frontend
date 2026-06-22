import { data, TestSchema, type TestFormInput } from "../schema";
import { Button, cn, DataTable, FormDialog, GN, Icons, InfoBox, Separator } from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import { columnsData } from "./columns/columnsData";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal17 } from "../modal17/Modal17";
import { useState } from "react";

export const Modal18 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
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

  const [modal17, setModal17] = useState(false);

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={onSubmit}
        submitText="확인"
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-250!"
      >
        <InfoBox>
          <li>
            자료복사 기능은 개별국가 출원시 발생되는 업무간소화를 위한 것으로 우선권과
            지정상품(류)만 복사되고 그외 진행사항/전자포대/메모 등 서브 정보는 복사되지 않습니다.
          </li>
        </InfoBox>

        <div className="flex justify-between pt-3 pb-2">
          <h2>자료복사</h2>
          <GN.CheckBox name="giveup-exception" size="sm" label="류별로 개국 생성하기" />
        </div>
        <div
          className={cn(
            "border-border-100 bg-bg-100 dark:bg-background-color/50 mb-3 flex border",
            "[&>h2]:border-border-100 [&>h2]:text-text-200 [&>h2]:border-r [&>h2]:p-2 [&>h2]:text-xs",
            "[&>p]:bg-white [&>p]:p-2 [&>p]:text-xs [&>p+h2]:border-l",
            "dark:[&>p]:bg-background-color dark:border-input dark:[&>p+h2]:border-input dark:[&>h2]:border-input",
          )}
        >
          <h2 className="min-w-34">기본 사무소 관리번호</h2>
          <p className="flex-1">TP2025-0082</p>
          <h2 className="min-w-34">기본 출원인 관리번호</h2>
          <p className="flex-1"></p>
          <h2 className="min-w-25">권리</h2>
          <p className="w-20 text-center">특허</p>
          <h2 className="min-w-25">생성갯수</h2>
          <p className="w-20 text-center">0</p>
        </div>

        <Separator className="my-4 border-y" />

        <div className="flex gap-2 pb-1">
          <Button size="h24" disabled>
            <Icons.Plus className="size-3" />
            선택삭제
          </Button>
          <Button size="h24" variant="outline-blue" onClick={() => setModal17(true)}>
            <Icons.Plus className="size-3" />
            개국생성 국가코드 추가
          </Button>
        </div>
        <div className="flex gap-4">
          <DataTable data={data} columns={columnsData} className="h-90 min-w-0 flex-1" size="sm" />
          <div className="border-border-100 bg-bg-50 dark:border-input dark:bg-background-color w-150 flex-1 rounded-md border p-4 text-xs">
            개국생성국가 중 체크된 개별국 자동 생성하며 개별국의
            <br />
            [사무소관리번호]는 다음과 같이 생성됩니다.
            <br />
            <br />
            지정국(또는 출원국가, 등록국가) 이용시 :
            <p className="text-p-color-4 pb-3">사무소관리번호 + / + 국가코드</p>
            <p className="text-p-color-4 pb-3">
              ex)US 국가 생성시
              <br />
              - 사무소관리번호(OurRef)가 Test인 경우 : Test/US
              <br />
              - 사무소관리번호(OurRef)가 Test/PCT인 경우 : Test/PCT/US
              <br />
            </p>
            참고롸 국가코드가 WO인 경우에는 사무소관리번호 생성시
            <br />
            국가코드 부분은 다음과 같이 변경되어 처리됩니다. WO {"-->"} PCT
          </div>
        </div>
      </FormDialog>
      <Modal17 open={modal17} onOpenChange={setModal17} title="개국생성 국가코드 추가" />
    </FormProvider>
  );
};
