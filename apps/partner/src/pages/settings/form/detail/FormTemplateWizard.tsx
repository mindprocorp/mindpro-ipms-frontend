import { useState, useEffect } from "react";
import { Button, Icons, Separator } from "@repo/ui";
import { FormProvider } from "react-hook-form";
import { orgQueries, formTemplateQueries } from "@shared/query/organization/queries";
import { CODE_CLASS } from "@shared/enum/organizationType";
import type { FormTemplateVO, FormTemplateTargetVO } from "@shared/api/organization/formTemplateApi";
import type { OfficeCodeVO } from "@shared/api/organization/orgApi";
import { useAlertStore } from "@shared/store/useAlertStore";
import { useAuthStore } from "@shared/store/useUserInfoStore";
import { useMutation } from "@tanstack/react-query";
import { useFormTemplateForm } from "../schema/form";
import { FORM_STEPS, FORM_STEP } from "../schema/constants";
import type { FormTemplateInput } from "../schema/formTemplateSchema";

import Step1BasicSettings from "./Step1BasicSettings";
import Step3Settings from "./Step3Settings";
import Step3Permission from "./Step3Permission";

interface Props {
  editSeq?: string;
  onClose: () => void;
  onSaved: () => void;
}

/* ── 위자드 전용 레이아웃 헬퍼 ── */

/** 라벨 좌측 고정폭 + 우측 컨트롤 */
export const FormRow = ({
  label,
  ess,
  tooltip,
  children,
  className,
  alignTop,
}: {
  label?: string;
  ess?: boolean;
  tooltip?: string;
  children: React.ReactNode;
  className?: string;
  alignTop?: boolean;
}) => (
  <div className={`flex ${alignTop ? "items-start" : "items-center"} min-h-11 py-2 ${className || ""}`}>
    {label !== undefined && (
      <div className="text-input-label flex w-44 shrink-0 items-center gap-1 text-sm font-medium">
        {label}
        {ess && <span className="bg-p-color-5 -ml-0.5 inline-block size-1 rounded-full" />}
        {tooltip && <Icons.Info className="text-muted-foreground size-3.5" title={tooltip} />}
      </div>
    )}
    <div className="flex-1">{children}</div>
  </div>
);

/** 섹션 구분 타이틀 */
export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="pb-2 pt-4 text-[15px] font-semibold">{children}</h3>
);

/* ── 위자드 본체 ── */

const FormTemplateWizard = ({ editSeq, onClose, onSaved }: Props) => {
  const { openAlert } = useAlertStore();
  const user = useAuthStore((s) => s.user);
  const getDetail = useMutation(formTemplateQueries.getDetail());
  const saveMut = useMutation(formTemplateQueries.save());
  const getCodeList = useMutation(orgQueries.getOfficeCodeList());
  const form = useFormTemplateForm();

  const [step, setStep] = useState(FORM_STEP.BASIC);
  const [templateData, setTemplateData] = useState<string>("");
  const [targets, setTargets] = useState<FormTemplateTargetVO[]>([]);
  const [categories, setCategories] = useState<OfficeCodeVO[]>([]);

  const title = editSeq ? (form.watch("templateName") || "서식 수정") : "서식 추가";

  useEffect(() => {
    const init = async () => {
      try {
        setCategories(await getCodeList.mutateAsync({ codeClass: CODE_CLASS.FORM_CATEGORY }));
        if (editSeq) {
          const detail = await getDetail.mutateAsync(editSeq);
          form.reset({
            categoryCode: detail.categoryCode || "", templateName: detail.templateName || "",
            useYn: detail.useYn || "Y", docModifyYn: detail.docModifyYn || "N",
            docNumYn: detail.docNumYn || "N", docNumFormat: detail.docNumFormat || "",
            footerYn: detail.footerYn || "N", footerContent: detail.footerContent || "",
            externalYn: detail.externalYn || "N", redirectUrl: detail.redirectUrl || "",
            apprTemplateSeq: detail.apprTemplateSeq || "",
            apprRequiredYn: detail.apprRequiredYn || "N", apprAdminSetYn: detail.apprAdminSetYn || "N",
            apprDefaultLineYn: detail.apprDefaultLineYn || "N", apprCondLineYn: detail.apprCondLineYn || "N",
            apprChangeAllowYn: detail.apprChangeAllowYn || "N", apprSkipUpperYn: detail.apprSkipUpperYn || "N",
            fullyApproveYn: detail.fullyApproveYn || "N",
            receiveYn: detail.receiveYn || "Y", receiveTiming: detail.receiveTiming || "APPROVED",
            receiveChangeYn: detail.receiveChangeYn || "Y",
            shareScope: detail.shareScope || "GROUP", shareTiming: detail.shareTiming || "APPROVED",
            shareChangeYn: detail.shareChangeYn || "Y",
            referenceYn: detail.referenceYn || "N",
            referenceTiming: detail.referenceTiming || "APPROVED",
            referenceChangeYn: detail.referenceChangeYn || "Y",
          });
          setTemplateData(detail.templateData || "");

          // targets (백엔드에서 이름/부서 JOIN 완료)
          setTargets(detail.targets || []);
        }
      } catch {
        openAlert({ message: "데이터를 불러오는데 실패했습니다." });
      }
    };
    init();
  }, [editSeq]);

  const handleSave = async () => {
    const values = form.getValues();
    if (!values.templateName?.trim()) {
      openAlert({ message: "서식명을 입력해주세요." });
      setStep(FORM_STEP.BASIC);
      return;
    }
    const payload: FormTemplateVO = {
      ...(editSeq ? { formTemplateSeq: editSeq } : {}),
      officeSeq: user?.officeId,
      categoryCode: values.categoryCode,
      templateName: values.templateName,
      useYn: values.useYn || "Y",
      docModifyYn: values.docModifyYn,
      docNumYn: values.docNumYn,
      docNumFormat: values.docNumFormat,
      footerYn: values.footerYn,
      footerContent: values.footerContent,
      externalYn: values.externalYn,
      redirectUrl: values.redirectUrl,
      apprTemplateSeq: values.apprTemplateSeq || undefined,
      apprRequiredYn: values.apprRequiredYn,
      apprAdminSetYn: values.apprAdminSetYn,
      apprDefaultLineYn: values.apprDefaultLineYn,
      apprCondLineYn: values.apprCondLineYn,
      apprChangeAllowYn: values.apprChangeAllowYn,
      apprSkipUpperYn: values.apprSkipUpperYn,
      fullyApproveYn: values.fullyApproveYn,
      receiveYn: values.receiveYn,
      receiveTiming: values.receiveTiming,
      receiveChangeYn: values.receiveChangeYn,
      shareScope: values.shareScope,
      shareTiming: values.shareTiming,
      shareChangeYn: values.shareChangeYn,
      referenceYn: values.referenceYn,
      referenceTiming: values.referenceTiming,
      referenceChangeYn: values.referenceChangeYn,
      templateData: templateData || undefined,
      targets,
      createUser: user?.userId || "",
      updateUser: user?.userId || "",
    };
    try {
      await saveMut.mutateAsync(payload);
      onSaved();
    } catch {
      openAlert({ message: "저장에 실패했습니다." });
    }
  };

  const handleCancel = () => {
    openAlert({
      title: "작성 취소",
      message: <p className="text-sm">저장하지 않은 내용은 사라집니다. 취소하시겠습니까?</p>,
      confirmText: "취소하기",
      cancelText: "계속 작성",
      onConfirm: onClose,
    });
  };

  return (
    <FormProvider {...form}>
      <div>
        {/* 헤더: < 서식 추가 */}
        <div className="flex items-center gap-2 pb-4">
          <Button size="icon-xs" variant="ghost" onClick={onClose}>
            <Icons.ChevronLeft className="size-5" />
          </Button>
          <h2 className="text-lg font-bold">{title}</h2>
        </div>

        {/* 탭 네비게이션 */}
        <nav className="mb-8 border-b">
          <ul className="flex">
            {FORM_STEPS.map((s) => {
              const isActive = step === s.key;
              return (
                <li key={s.key} className="flex-1">
                  <button
                    type="button"
                    onClick={() => setStep(s.key)}
                    className={`relative flex w-full items-center justify-center gap-1.5 py-3 text-sm transition-colors ${
                      isActive ? "font-semibold text-blue-600" : "text-foreground"
                    }`}
                  >
                    {s.key}. {s.label}
                    {isActive && (
                      <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-t bg-blue-600" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 스텝 콘텐츠 */}
        <div className="min-h-[400px]">
          {step === FORM_STEP.BASIC && <Step1BasicSettings categories={categories} templateData={templateData} onTemplateDataChange={setTemplateData} />}
          {step === FORM_STEP.SETTINGS && <Step3Settings targets={targets} onTargetsChange={setTargets} />}
          {step === FORM_STEP.PERMISSION && <Step3Permission targets={targets} onTargetsChange={setTargets} />}
        </div>

        {/* 하단 버튼 */}
        <Separator className="mt-8" />
        <div className="flex justify-end gap-2 py-4">
          <Button size="h28" variant="outline" onClick={handleCancel}>취소</Button>
          <Button size="h28" variant="blue" onClick={handleSave}>저장</Button>
        </div>
      </div>
    </FormProvider>
  );
};

export default FormTemplateWizard;
