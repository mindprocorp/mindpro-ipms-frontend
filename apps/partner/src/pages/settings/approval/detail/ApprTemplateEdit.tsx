import { useState, useMemo } from "react";
import { Button, FlexBox, Icons, Input, RHF, Separator } from "@repo/ui";
import SelectBox from "../../_components/common/SelectBox";
import { UserModal, type SuccessData } from "@pages/common/modal/user/UserModal";
import type { ApprTemplateVO, ApprTemplateLineVO, ApproverType } from "@shared/api/organization/apprTemplateApi";
import type { OfficeCodeVO } from "@shared/api/organization/orgApi";
import { FormProvider, useForm } from "react-hook-form";
import { FormRow, SectionTitle } from "../../form/detail/FormTemplateWizard";
import ApproverLabel from "./_components/ApproverLabel";

const APPROVER_TYPES: { label: string; value: string }[] = [
  { label: "선택", value: "" },
  { label: "본인 (기안자)", value: "SELF" },
  { label: "직접 지정", value: "DIRECT_PERSON" },
];

type StepGroup = {
  stepOrder: string;
  stepType: string;
  stepName: string;
  approvers: { idx: number; line: ApprTemplateLineVO }[];
};

interface Props {
  data: ApprTemplateVO;
  stepTypes: OfficeCodeVO[];
  onSave: (data: ApprTemplateVO) => void;
  onCancel: () => void;
}

const ApprTemplateEdit = ({ data: initial, stepTypes, onSave, onCancel }: Props) => {
  const [editData, setEditData] = useState<ApprTemplateVO>(initial);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTargetIdx, setPopupTargetIdx] = useState<number | null>(null);

  const form = useForm({ defaultValues: { templateName: initial.templateName || "" } });
  const lines = editData.lines || [];

  const title = editData.apprTemplateSeq ? "결재선 템플릿 수정" : "결재선 템플릿 만들기";

  const stepGroups = useMemo(() => {
    const groups: StepGroup[] = [];
    lines.forEach((l, i) => {
      const existing = groups.find((g) => g.stepOrder === l.stepOrder);
      if (existing) {
        existing.approvers.push({ idx: i, line: l });
      } else {
        groups.push({ stepOrder: l.stepOrder, stepType: l.stepType, stepName: l.stepName, approvers: [{ idx: i, line: l }] });
      }
    });
    return groups;
  }, [lines]);

  const setLines = (newLines: ApprTemplateLineVO[]) =>
    setEditData((prev) => ({ ...prev, lines: newLines }));

  const addStep = () => {
    const nextOrder = String(stepGroups.length + 1);
    setLines([...lines, { stepOrder: nextOrder, stepType: "", stepName: "", approverType: "DIRECT_PERSON", approverName: "" }]);
  };

  const addApproverToStep = (stepOrder: string, stepType: string, stepName: string) => {
    setLines([...lines, { stepOrder, stepType, stepName, approverType: "DIRECT_PERSON", approverName: "" }]);
  };

  const updateStepInfo = (stepOrder: string, field: "stepType" | "stepName", val: string) => {
    setLines(lines.map((l) => (l.stepOrder === stepOrder ? { ...l, [field]: val } : l)));
  };

  const updateApproverType = (idx: number, val: string) => {
    const updated = [...lines];
    updated[idx] = { ...updated[idx], approverType: val as ApproverType, approverRefSeq: undefined, approverName: val === "SELF" ? "본인" : "" };
    setLines(updated);
  };

  const removeApprover = (idx: number) => {
    const targetOrder = lines[idx].stepOrder;
    const isLastInStep = lines.filter((l) => l.stepOrder === targetOrder).length === 1;
    const remaining = lines.filter((_, i) => i !== idx);
    if (isLastInStep) {
      const orders = [...new Set(remaining.map((l) => l.stepOrder))].sort();
      const orderMap = Object.fromEntries(orders.map((old, i) => [old, String(i + 1)]));
      setLines(remaining.map((l) => ({ ...l, stepOrder: orderMap[l.stepOrder] })));
    } else {
      setLines(remaining);
    }
  };

  const selectApprover = (idx: number) => { setPopupTargetIdx(idx); setPopupOpen(true); };

  const handlePersonSelected = (rtnData: SuccessData) => {
    if (popupTargetIdx === null || !rtnData.userInfo?.length) return;
    const selected = rtnData.userInfo[0];
    if (!selected || popupTargetIdx < 0 || popupTargetIdx >= lines.length) return;
    const updated = [...lines];
    updated[popupTargetIdx] = { ...updated[popupTargetIdx], approverRefSeq: selected.id, approverName: selected.name };
    setLines(updated);
    setPopupTargetIdx(null);
  };

  const handleSave = () => onSave({ ...editData, templateName: form.getValues("templateName") });

  const stepTypeOptions = stepTypes.map((t) => ({ label: t.codeName, value: t.officeCode }));

  return (
    <FormProvider {...form}>
      <form onSubmit={(e) => e.preventDefault()}>
        {/* 헤더 */}
        <div className="flex items-center gap-2 pb-4">
          <Button size="icon-xs" variant="ghost" onClick={onCancel}>
            <Icons.ChevronLeft className="size-5" />
          </Button>
          <h2 className="text-lg font-bold">{title}</h2>
        </div>

        {/* 기본 정보 */}
        <SectionTitle>기본 정보</SectionTitle>
        <FormRow label="결재선명" ess>
          <RHF.Input control={form.control} name="templateName" placeholder="결재선명 입력" />
        </FormRow>

        {/* 결재 단계 */}
        <Separator className="my-6" />
        <div className="flex items-center justify-between pb-2">
          <SectionTitle>결재 단계</SectionTitle>
          <Button size="h24" variant="outline" className="text-xs" onClick={addStep}>
            <Icons.Plus className="size-3.5" /> 단계 추가
          </Button>
        </div>

        <div className="min-h-[200px]">
          {stepGroups.map((group) => (
            <div key={group.stepOrder} className="space-y-2 border-b py-4 last:border-b-0">
              <FlexBox className="items-center justify-between gap-3">
                <FlexBox className="items-center gap-3">
                  <span className="bg-blue-600 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                    {group.stepOrder}
                  </span>
                  <SelectBox value={group.stepType} onChange={(v) => updateStepInfo(group.stepOrder, "stepType", v)} placeholder="결재유형" options={stepTypeOptions} className="h-8 w-32" />
                  <Input className="h-8 w-40" placeholder="단계명" value={group.stepName} onChange={(e) => updateStepInfo(group.stepOrder, "stepName", e.target.value)} />
                </FlexBox>
                <Button size="h24" variant="ghost" className="text-xs" onClick={() => addApproverToStep(group.stepOrder, group.stepType, group.stepName)}>
                  <Icons.UserPlus className="size-3" /> 결재자 추가
                </Button>
              </FlexBox>

              <div className="ml-9 space-y-1.5">
                {group.approvers.map(({ idx, line }) => (
                  <FlexBox key={idx} className="items-center justify-between gap-2">
                    <FlexBox className="items-center gap-2">
                      <SelectBox value={line.approverType || ""} onChange={(v) => updateApproverType(idx, v)} placeholder="유형" options={APPROVER_TYPES} className="h-7 w-32" />
                      <ApproverLabel line={line} onSelect={() => selectApprover(idx)} />
                    </FlexBox>
                    <FlexBox className="items-center gap-1">
                      {line.approverType === "DIRECT_PERSON" && line.approverName && (
                        <Button size="h24" variant="ghost" className="text-muted-foreground text-xs" onClick={() => selectApprover(idx)}>변경</Button>
                      )}
                      <Button size="icon-xs" variant="ghost-red" onClick={() => removeApprover(idx)}>
                        <Icons.Trash2 className="size-3.5" />
                      </Button>
                    </FlexBox>
                  </FlexBox>
                ))}
                {group.approvers.length > 1 && (
                  <p className="text-muted-foreground text-xs">* 같은 단계에 여러 결재자가 있으면 모두 결재해야 다음 단계로 진행됩니다.</p>
                )}
              </div>
            </div>
          ))}

          {stepGroups.length === 0 && (
            <p className="text-muted-foreground py-8 text-center text-xs">단계 추가 버튼을 눌러 결재 단계를 추가해주세요.</p>
          )}
        </div>

        {/* 하단 버튼 */}
        <Separator className="mt-6" />
        <div className="flex justify-end gap-2 py-4">
          <Button size="h28" variant="outline" onClick={onCancel}>목록</Button>
          <Button size="h28" variant="blue" onClick={handleSave}>저장</Button>
        </div>
      </form>

      <UserModal
        title="결재자 선택"
        input={{ inputKey: "approver", inputName: "결재자" }}
        open={popupOpen}
        onOpenChange={setPopupOpen}
        onSuccess={handlePersonSelected}
      />
    </FormProvider>
  );
};

export default ApprTemplateEdit;
