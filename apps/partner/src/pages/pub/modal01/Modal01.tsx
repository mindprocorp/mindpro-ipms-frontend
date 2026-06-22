import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FlexBox, FormDialog, RHF, Separator } from "@repo/ui";
import { z } from "zod";

// 백엔드 응답이 null/undefined 로 내려와도 "" 로 강제 후 검증 — 수정 모드 호환
const zsReq = (msg: string, max?: number) => {
  let s = z.string().min(1, msg);
  if (max) s = s.max(max, `최대 ${max}자까지 입력 가능합니다`);
  return z.preprocess((v) => (v == null ? "" : v), s);
};
const zsOpt = (max?: number) => {
  let s = z.string();
  if (max) s = s.max(max, `최대 ${max}자까지 입력 가능합니다`);
  return z.preprocess((v) => (v == null ? "" : v), s);
};

const LowerCourtSchema = z.object({
  judgmentCaseNo: zsReq("판결사건번호를 입력해주세요", 255),
  resultDecisionDate: zsReq("판결일을 선택해주세요"),
  judgmentContent: zsReq("판결내용을 입력해주세요", 2000),
  judgmentCategory: z.object({
    code: zsReq("판결 구분을 입력해주세요", 30),
    codeName: zsOpt(),
  }),
  judgmentSearchUrl: zsOpt(2000),
  note: zsOpt(2000),
});

type LowerCourtFormInput = z.input<typeof LowerCourtSchema>;
type LowerCourtFormOutput = z.output<typeof LowerCourtSchema>;

type ConflictResultItem = LowerCourtFormOutput;

type Modal01Props = {
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (rtnData: ConflictResultItem) => void;
  editData?: Partial<ConflictResultItem> | null;
};

const EMPTY_VALUES: LowerCourtFormInput = {
  judgmentCaseNo: "",
  resultDecisionDate: "",
  judgmentContent: "",
  judgmentCategory: { code: "", codeName: "" },
  judgmentSearchUrl: "",
  note: "",
};

// editData 의 null 필드를 "" 로 정규화 — RHF reset 시 zod input 으로 안전하게 들어가도록.
const normalizeEditData = (d: Partial<ConflictResultItem> | null | undefined): LowerCourtFormInput => ({
  judgmentCaseNo: d?.judgmentCaseNo ?? "",
  resultDecisionDate: d?.resultDecisionDate ?? "",
  judgmentContent: d?.judgmentContent ?? "",
  judgmentCategory: {
    code: d?.judgmentCategory?.code ?? "",
    codeName: d?.judgmentCategory?.codeName ?? "",
  },
  judgmentSearchUrl: d?.judgmentSearchUrl ?? "",
  note: d?.note ?? "",
});

export const Modal01 = ({ title, open, onOpenChange, onSuccess, editData }: Modal01Props) => {
  const form = useForm<LowerCourtFormInput>({
    resolver: zodResolver(LowerCourtSchema),
    defaultValues: EMPTY_VALUES,
  });

  const { reset, handleSubmit, control } = form;

  React.useEffect(() => {
    if (!open) return;
    reset(editData ? normalizeEditData(editData) : EMPTY_VALUES);
  }, [open, editData, reset]);

  const onSubmit = (values: LowerCourtFormInput) => {
    const parsed: LowerCourtFormOutput = LowerCourtSchema.parse(values);
    onSuccess?.(parsed);
    onOpenChange(false);
  };

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={handleSubmit(onSubmit)}
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-180!"
      >
        <FlexBox vertical className="gap-6 py-4">
          <FlexBox className="gap-4">
            <RHF.Input
              control={control}
              name="judgmentCaseNo"
              label="판결사건번호"
              ess
              maxLength={255}
              className="flex-1"
            />
            <RHF.FormDatePicker
              control={control}
              name="resultDecisionDate"
              label="판결일"
              ess
              className="flex-1"
            />
            <RHF.Input
              control={control}
              name="judgmentCategory.code"
              label="판결 구분"
              ess
              maxLength={30}
              className="flex-1"
            />
          </FlexBox>

          <Separator className="border-t" />

          <FlexBox vertical className="gap-4">
            <RHF.FormTextarea
              control={control}
              name="judgmentContent"
              label="판결내용"
              ess
              maxLength={2000}
            />
            <RHF.Input
              control={control}
              name="judgmentSearchUrl"
              label="판결문 경로"
              urlOnly
              maxLength={2000}
            />
            <RHF.FormTextarea
              control={control}
              name="note"
              label="비고"
              maxLength={2000}
            />
          </FlexBox>
        </FlexBox>
      </FormDialog>
    </FormProvider>
  );
};
