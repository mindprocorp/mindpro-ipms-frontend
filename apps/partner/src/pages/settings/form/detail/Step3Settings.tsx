import { useState, useEffect } from "react";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Icons, RHF, Separator } from "@repo/ui";
import { useFormContext, useWatch } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apprTemplateQueries } from "@shared/query/organization/queries";
import type { ApprTemplateVO } from "@shared/api/organization/apprTemplateApi";
import ApprLinePreview from "@pages/approval/_common/ApprLinePreview";
import type { FormTemplateTargetVO } from "@shared/api/organization/formTemplateApi";
import type { FormTemplateInput } from "../schema/formTemplateSchema";
import { ALLOW_ITEMS, USE_ITEMS, TIMING_RECEIVE_ITEMS, TIMING_SHARE_ITEMS, TIMING_REFERENCE_ITEMS, SCOPE_ITEMS } from "../schema/constants";
import { FormRow, SectionTitle } from "./FormTemplateWizard";
import TargetTable from "./_common/TargetTable";

interface Props {
  targets: FormTemplateTargetVO[];
  onTargetsChange: (t: FormTemplateTargetVO[]) => void;
}

const Step3Settings = ({ targets, onTargetsChange }: Props) => {
  const { control, setValue } = useFormContext<FormTemplateInput>();
  const apprTemplateSeq = useWatch({ control, name: "apprTemplateSeq" });
  const receiveYn = useWatch({ control, name: "receiveYn" });
  const shareScope = useWatch({ control, name: "shareScope" });
  const referenceYn = useWatch({ control, name: "referenceYn" });

  const [templates, setTemplates] = useState<ApprTemplateVO[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewAppr, setPreviewAppr] = useState<ApprTemplateVO | null>(null);

  const getListMut = useMutation(apprTemplateQueries.getList());
  const getDetailMut = useMutation(apprTemplateQueries.getDetail());

  useEffect(() => {
    getListMut.mutateAsync({ templateName: undefined }).then(setTemplates).catch((e) => {
      console.error("결재선 템플릿 목록 조회 실패", e);
    });
  }, []);

  return (
    <div>
      {/* ── 결재선 설정 ───────────────────────────────── */}
      <SectionTitle>결재선 설정</SectionTitle>

      <FormRow label="기본 결재선">
        <div className="flex items-center gap-2">
          <Button size="h28" variant="outline" onClick={() => setDialogOpen(true)}>
            <Icons.List className="size-3.5" /> {apprTemplateSeq ? "변경" : "결재선 선택"}
          </Button>
          {apprTemplateSeq && (
            <>
              <span className="rounded-full bg-p-color-1/10 px-2.5 py-0.5 text-xs font-medium text-p-color-1">
                {templates.find((t) => t.apprTemplateSeq === apprTemplateSeq)?.templateName || apprTemplateSeq}
              </span>
              <button type="button" onClick={() => setValue("apprTemplateSeq", "")} className="text-muted-foreground hover:text-destructive">
                <Icons.X className="size-3.5" />
              </button>
            </>
          )}
        </div>
      </FormRow>

      <FormRow label="결재선 변경 허용">
        <RHF.FormRadio control={control} name="apprChangeAllowYn" items={ALLOW_ITEMS} wrapClassName="w-auto items-start" height="auto" />
      </FormRow>

      <Separator className="my-6" />

      {/* ── 수신 설정 ─────────────────────────────────── */}
      <SectionTitle>수신 설정</SectionTitle>

      <FormRow label="수신 사용">
        <RHF.FormRadio control={control} name="receiveYn" items={USE_ITEMS} wrapClassName="w-auto items-start" height="auto" />
      </FormRow>

      {receiveYn === "Y" && (
        <>
          <FormRow label="수신 시점">
            <RHF.FormRadio control={control} name="receiveTiming" items={TIMING_RECEIVE_ITEMS} wrapClassName="w-auto items-start" height="auto" />
          </FormRow>
          <FormRow label="수신 대상" alignTop>
            <TargetTable targets={targets} onTargetsChange={onTargetsChange} role="RECEIVE" label="수신 대상" />
          </FormRow>
          <FormRow label="수신 변경 허용">
            <RHF.FormRadio control={control} name="receiveChangeYn" items={ALLOW_ITEMS} wrapClassName="w-auto items-start" height="auto" />
          </FormRow>
        </>
      )}

      <Separator className="my-6" />

      {/* ── 공유 설정 ─────────────────────────────────── */}
      <SectionTitle>공유 설정</SectionTitle>

      <FormRow label="공유 범위">
        <RHF.FormRadio control={control} name="shareScope" items={SCOPE_ITEMS} wrapClassName="w-auto items-start" height="auto" />
      </FormRow>

      <FormRow label="공유 시점">
        <RHF.FormRadio control={control} name="shareTiming" items={TIMING_SHARE_ITEMS} wrapClassName="w-auto items-start" height="auto" />
      </FormRow>

      {shareScope === "GROUP" && (
        <FormRow label="공유 대상" alignTop>
          <TargetTable targets={targets} onTargetsChange={onTargetsChange} role="SHARE_GROUP" label="공유 대상" />
        </FormRow>
      )}

      <FormRow label="공유 변경 허용">
        <RHF.FormRadio control={control} name="shareChangeYn" items={ALLOW_ITEMS} wrapClassName="w-auto items-start" height="auto" />
      </FormRow>

      <Separator className="my-6" />

      {/* ── 참조 설정 ─────────────────────────────────── */}
      <SectionTitle>참조 설정</SectionTitle>

      <FormRow label="참조 사용">
        <RHF.FormRadio control={control} name="referenceYn" items={USE_ITEMS} wrapClassName="w-auto items-start" height="auto" />
      </FormRow>

      {referenceYn === "Y" && (
        <>
          <FormRow label="참조 시점">
            <RHF.FormRadio control={control} name="referenceTiming" items={TIMING_REFERENCE_ITEMS} wrapClassName="w-auto items-start" height="auto" />
          </FormRow>
          <FormRow label="참조 대상" alignTop>
            <TargetTable targets={targets} onTargetsChange={onTargetsChange} role="REFERENCE" label="참조 대상" />
          </FormRow>
          <FormRow label="참조 변경 허용">
            <RHF.FormRadio control={control} name="referenceChangeYn" items={ALLOW_ITEMS} wrapClassName="w-auto items-start" height="auto" />
          </FormRow>
        </>
      )}

      {/* 결재선 선택 다이얼로그 */}
      <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) setPreviewAppr(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>결재선 템플릿 선택</DialogTitle></DialogHeader>
          <div className="flex gap-4">
            <div className="max-h-72 w-1/2 space-y-1 overflow-auto border-r pr-4">
              {templates.map((t) => (
                <button
                  key={t.apprTemplateSeq}
                  type="button"
                  onClick={async () => {
                    const detail = await getDetailMut.mutateAsync(t.apprTemplateSeq!);
                    setPreviewAppr(detail);
                  }}
                  className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm hover:bg-muted ${
                    previewAppr?.apprTemplateSeq === t.apprTemplateSeq ? "bg-muted" : apprTemplateSeq === t.apprTemplateSeq ? "bg-p-color-1/5 font-medium text-p-color-1" : ""
                  }`}
                >
                  <span>{t.templateName}</span>
                  {apprTemplateSeq === t.apprTemplateSeq && <Icons.Check className="size-4 text-p-color-1" />}
                </button>
              ))}
              {!templates.length && <p className="py-4 text-center text-sm text-muted-foreground">등록된 결재선 템플릿이 없습니다.</p>}
            </div>
            <div className="w-1/2">
              {previewAppr ? (
                <>
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">결재 단계</p>
                  <ApprLinePreview lines={previewAppr.lines || []} />
                  <Button size="h28" variant="blue" className="mt-4 w-full" onClick={() => {
                    setValue("apprTemplateSeq", previewAppr.apprTemplateSeq || "");
                    setDialogOpen(false);
                  }}>
                    선택
                  </Button>
                </>
              ) : (
                <p className="py-8 text-center text-xs text-muted-foreground">좌측에서 결재선을 클릭하면<br />단계를 미리볼 수 있습니다.</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Step3Settings;
