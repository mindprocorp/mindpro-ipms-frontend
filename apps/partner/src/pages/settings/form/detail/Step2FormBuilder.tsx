import { useState, useMemo } from "react";
import { Button, Icons } from "@repo/ui";
import { FormRow } from "./FormTemplateWizard";
import FormEditor from "../editor/FormEditor";

interface Props {
  templateData?: string;
  onTemplateDataChange?: (data: string) => void;
}

/** TipTap JSON에서 폼 블록 목록 추출 */
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
  } catch {
    return [];
  }
};

const Step2FormBuilder = ({ templateData, onTemplateDataChange }: Props) => {
  const [editorOpen, setEditorOpen] = useState(false);
  const blocks = useMemo(() => extractBlocks(templateData), [templateData]);
  const hasContent = !!templateData && blocks.length > 0;

  const handleSave = (data: { title: string; content: string }) => {
    onTemplateDataChange?.(data.content);
    setEditorOpen(false);
  };

  return (
    <>
      <div>
        <FormRow label="서식 만들기" alignTop>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button variant="blue" size="h36" onClick={() => setEditorOpen(true)}>
                {hasContent ? "서식 편집기 수정" : "서식 편집기"}
              </Button>
            </div>

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
              <p className="text-muted-foreground text-sm">
                서식 편집기를 사용해서 서식을 만들어 주세요.
              </p>
            )}
          </div>
        </FormRow>
      </div>

      {editorOpen && (
        <FormEditor
          initialContent={templateData}
          onSave={handleSave}
          onCancel={() => setEditorOpen(false)}
        />
      )}
    </>
  );
};

export default Step2FormBuilder;
