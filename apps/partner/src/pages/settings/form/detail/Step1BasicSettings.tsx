import { useState, useMemo } from "react";
import { Button, Icons, RHF } from "@repo/ui";
import { useFormContext, useWatch } from "react-hook-form";
import type { OfficeCodeVO } from "@shared/api/organization/orgApi";
import type { FormTemplateInput } from "../schema/formTemplateSchema";
import { FormRow } from "./FormTemplateWizard";
import FormEditor from "../editor/FormEditor";

interface Props {
  categories: OfficeCodeVO[];
  templateData?: string;
  onTemplateDataChange?: (data: string) => void;
}

const extractBlocks = (data?: string) => {
  if (!data) return [];
  try {
    const json = JSON.parse(data);
    if (!json?.content) return [];
    return (json.content as any[]).filter((n) => n.type === "formBlock").map((n) => ({
      type: n.attrs?.blockType || "",
      label: n.attrs?.name || n.attrs?.blockLabel || "",
      required: n.attrs?.required || false,
    }));
  } catch { return []; }
};

const Step1BasicSettings = ({ categories, templateData, onTemplateDataChange }: Props) => {
  const { control } = useFormContext<FormTemplateInput>();
  const footerYn = useWatch({ control, name: "footerYn" });
  const templateName = useWatch({ control, name: "templateName" });
  const [editorOpen, setEditorOpen] = useState(false);

  const categoryItems = categories.map((c) => ({ label: c.codeName, value: c.officeCode }));
  const blocks = useMemo(() => extractBlocks(templateData), [templateData]);
  const hasContent = !!templateData && blocks.length > 0;

  return (
    <>
      <div>
        <FormRow label="카테고리" ess>
          <RHF.FormSelect
            control={control}
            name="categoryCode"
            items={[{ label: "선택", value: "" }, ...categoryItems]}
            search
          />
        </FormRow>

        <FormRow label="서식명" ess>
          <RHF.Input control={control} name="templateName" />
        </FormRow>

        {/* 문서 제목 */}
        <FormRow label="문서 기본 제목">
          <RHF.Input control={control} name="docNumFormat" placeholder="기안 작성 시 기본 제목으로 사용됩니다." />
        </FormRow>

        <FormRow label="">
          <RHF.FormCheckbox control={control} name="docModifyYn" label="기안자가 제목 수정 불가" outputFormat={["Y", "N"]} height="auto" />
        </FormRow>

        {/* 서식 만들기 */}
        <FormRow label="서식 만들기" alignTop>
          <div className="space-y-3">
            <Button variant="blue" size="h36" onClick={() => setEditorOpen(true)}>
              {hasContent ? "서식 편집기 수정" : "서식 편집기"}
            </Button>

            {hasContent ? (
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Icons.CheckCircle className="size-4 text-green-500" />
                  <span className="text-sm font-medium">서식이 구성되었습니다.</span>
                  <span className="text-muted-foreground text-xs">({blocks.length}개 컴포넌트)</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {blocks.map((b, i) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded-md border bg-muted/40 px-2 py-1 text-xs">
                      {b.label}
                      {b.required && <span className="text-red-500">*</span>}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">서식 편집기를 사용해서 서식을 만들어 주세요.</p>
            )}
          </div>
        </FormRow>

        {/* 서식 하단 설명 */}
        <FormRow label="서식 하단 설명 영역">
          <RHF.FormCheckbox
            control={control}
            name="footerYn"
            label="기본으로 제공될 서식 하단 설명 작성"
            outputFormat={["Y", "N"]}
            height="auto"
          />
        </FormRow>

        {footerYn === "Y" && (
          <FormRow label="">
            <RHF.FormTextarea
              control={control}
              name="footerContent"
              placeholder="내용을 입력하세요"
            />
          </FormRow>
        )}

        {/* ── 미구현 기능 (DB 저장은 됨) ──────────────────────
        <FormRow label="작성 위치" tooltip="외부 결재 API 연동 (미구현)">
          <RHF.FormCheckbox control={control} name="externalYn" label="외부에서 상신" outputFormat={["Y", "N"]} height="auto" />
        </FormRow>
        {externalYn === "Y" && (
          <FormRow label="작성 완료 후 이동">
            <RHF.Input control={control} name="redirectUrl" placeholder="'http://'를 포함한 전체 URL을 입력하세요." />
          </FormRow>
        )}
        ── */}
      </div>

      {editorOpen && (
        <FormEditor
          initialContent={templateData}
          initialTitle={templateName || ""}
          onSave={(data) => { onTemplateDataChange?.(data.content); setEditorOpen(false); }}
          onCancel={() => setEditorOpen(false)}
        />
      )}
    </>
  );
};

export default Step1BasicSettings;
