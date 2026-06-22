import { useState, useEffect, useMemo } from "react";
import { Button, DataTable, Dialog, DialogContent, DialogHeader, DialogTitle, Icons, RHF, Separator, Switch } from "@repo/ui";
import { useFormContext, useWatch } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apprTemplateQueries } from "@shared/query/organization/queries";
import type { ApprTemplateVO } from "@shared/api/organization/apprTemplateApi";
import type { ColumnDef } from "@tanstack/react-table";
import type { FormTemplateTargetVO } from "@shared/api/organization/formTemplateApi";
import type { FormTemplateInput } from "../schema/formTemplateSchema";
import { ALLOW_ITEMS, USE_ITEMS } from "../schema/constants";
import { FormRow, SectionTitle } from "./FormTemplateWizard";

interface Props {
  targets: FormTemplateTargetVO[];
  onTargetsChange: (t: FormTemplateTargetVO[]) => void;
}

type ApprLineRow = {
  order: number;
  name: string;
  seq: string;
  type: "DEFAULT" | "CONDITION";
};

const Step3ApprovalLine = ({ targets, onTargetsChange }: Props) => {
  const { control, setValue } = useFormContext<FormTemplateInput>();
  const apprAdminSetYn = useWatch({ control, name: "apprAdminSetYn" });
  const apprDefaultLineYn = useWatch({ control, name: "apprDefaultLineYn" });
  const apprCondLineYn = useWatch({ control, name: "apprCondLineYn" });

  const getList = useMutation(apprTemplateQueries.getList());

  // 등록 가능한 결재선 템플릿 전체 목록
  const [allTemplates, setAllTemplates] = useState<ApprTemplateVO[]>([]);
  // 이 서식에 추가된 결재선 목록
  const [selectedLines, setSelectedLines] = useState<ApprLineRow[]>([]);
  // 선택 팝업
  const [selectOpen, setSelectOpen] = useState(false);
  const [selectType, setSelectType] = useState<"DEFAULT" | "CONDITION">("DEFAULT");

  useEffect(() => {
    getList.mutateAsync({}).then(setAllTemplates);
  }, []);

  const handleOpenSelect = (type: "DEFAULT" | "CONDITION") => {
    setSelectType(type);
    setSelectOpen(true);
  };

  const handleSelect = (tmpl: ApprTemplateVO) => {
    // 이미 추가된 건 무시
    if (selectedLines.some((l) => l.seq === tmpl.apprTemplateSeq)) return;
    setSelectedLines((prev) => [
      ...prev,
      {
        order: prev.length + 1,
        name: tmpl.templateName,
        seq: tmpl.apprTemplateSeq!,
        type: selectType,
      },
    ]);
    setSelectOpen(false);
  };

  const handleRemove = (seq: string) => {
    setSelectedLines((prev) => {
      const next = prev.filter((l) => l.seq !== seq);
      return next.map((l, i) => ({ ...l, order: i + 1 }));
    });
  };

  const defaultLines = selectedLines.filter((l) => l.type === "DEFAULT");
  const condLines = selectedLines.filter((l) => l.type === "CONDITION");
  const displayLines = [
    ...defaultLines.map((l, i) => ({ ...l, order: i + 1 })),
    ...condLines.map((l, i) => ({ ...l, order: defaultLines.length + i + 1 })),
  ];

  const columns: ColumnDef<ApprLineRow>[] = useMemo(() => [
    { id: "order", header: "적용 순서", size: 80, cell: ({ row }) => row.original.order },
    {
      id: "type", header: "유형", size: 100,
      cell: ({ row }) => (
        <span className={`rounded px-2 py-0.5 text-xs ${row.original.type === "DEFAULT" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
          {row.original.type === "DEFAULT" ? "기본" : "조건별"}
        </span>
      ),
    },
    { id: "name", header: "결재선", cell: ({ row }) => row.original.name },
    {
      id: "delete", header: "삭제", size: 60,
      cell: ({ row }) => (
        <Button size="icon-xs" variant="ghost-red" onClick={() => handleRemove(row.original.seq)}>
          <Icons.Trash2 className="size-3.5" />
        </Button>
      ),
    },
  ], [handleRemove]);

  // 팝업에서 아직 추가 안 된 템플릿만 표시
  const availableTemplates = allTemplates.filter(
    (t) => !selectedLines.some((l) => l.seq === t.apprTemplateSeq),
  );

  return (
    <div>
      <SectionTitle>결재선 설정</SectionTitle>

      <FormRow label="결재선 필수 여부" tooltip="결재선을 필수로 지정합니다">
        <RHF.FormCheckbox
          control={control}
          name="apprRequiredYn"
          label="필수"
          outputFormat={["Y", "N"]}
          height="auto"
        />
      </FormRow>

      <FormRow label="관리자가 결재선 설정">
        <Switch
          checked={apprAdminSetYn === "Y"}
          onCheckedChange={(v) => setValue("apprAdminSetYn", v ? "Y" : "N")}
        />
      </FormRow>

      {apprAdminSetYn === "Y" && (
        <>
          <FormRow label="기본 결재선">
            <Switch
              checked={apprDefaultLineYn === "Y"}
              onCheckedChange={(v) => setValue("apprDefaultLineYn", v ? "Y" : "N")}
            />
          </FormRow>

          <FormRow label="조건별 결재선">
            <Switch
              checked={apprCondLineYn === "Y"}
              onCheckedChange={(v) => setValue("apprCondLineYn", v ? "Y" : "N")}
            />
          </FormRow>

          <div className="pb-4 pl-44">
            <div className="flex gap-2 pb-2">
              <Button
                size="h28"
                variant="outline"
                disabled={apprDefaultLineYn !== "Y"}
                onClick={() => handleOpenSelect("DEFAULT")}
              >
                기본 결재선 추가
              </Button>
              <Button
                size="h28"
                variant="outline"
                disabled={apprCondLineYn !== "Y"}
                onClick={() => handleOpenSelect("CONDITION")}
              >
                조건별 결재선 추가
              </Button>
            </div>
            {displayLines.length > 0 ? (
              <DataTable data={displayLines} columns={columns} />
            ) : (
              <div className="rounded-md border py-6 text-center text-sm text-muted-foreground">
                결재자가 없습니다. 결재선을 설정해 주세요.
              </div>
            )}
          </div>
        </>
      )}

      <FormRow label="결재선 변경 허용" tooltip="기안자가 결재선을 변경할 수 있는지 설정합니다">
        <RHF.FormRadio
          control={control}
          name="apprChangeAllowYn"
          items={ALLOW_ITEMS}
          wrapClassName="w-auto items-start"
          height="auto"
        />
      </FormRow>

      <FormRow label="추가 설정">
        <RHF.FormCheckbox
          control={control}
          name="apprSkipUpperYn"
          label="상위 부서장이 없는 경우 생략"
          outputFormat={["Y", "N"]}
          height="auto"
        />
      </FormRow>

      <Separator className="my-6" />
      <SectionTitle>전결 관리</SectionTitle>

      <FormRow label="전결 사용 여부">
        <RHF.FormRadio
          control={control}
          name="fullyApproveYn"
          items={USE_ITEMS}
          wrapClassName="w-auto items-start"
          height="auto"
        />
      </FormRow>

      {/* 결재선 선택 팝업 */}
      <Dialog open={selectOpen} onOpenChange={setSelectOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectType === "DEFAULT" ? "기본" : "조건별"} 결재선 선택
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-80 overflow-auto">
            {availableTemplates.length > 0 ? (
              availableTemplates.map((tmpl) => (
                <button
                  key={tmpl.apprTemplateSeq}
                  type="button"
                  className="flex w-full items-center justify-between rounded-md px-4 py-3 text-left transition-colors hover:bg-muted/50"
                  onClick={() => handleSelect(tmpl)}
                >
                  <div>
                    <p className="text-sm font-medium">{tmpl.templateName}</p>
                    {tmpl.lines && tmpl.lines.length > 0 && (
                      <p className="text-muted-foreground text-xs">
                        {tmpl.lines.map((l) => l.stepName || `${l.stepOrder}단계`).join(" → ")}
                      </p>
                    )}
                  </div>
                  <Icons.Plus className="size-4 text-muted-foreground" />
                </button>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                추가 가능한 결재선이 없습니다.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Step3ApprovalLine;
