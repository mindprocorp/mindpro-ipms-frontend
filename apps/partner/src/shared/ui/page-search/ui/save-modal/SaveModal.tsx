import type { ModalProps } from "@repo/schema";
import { FormDialog, Input } from "@repo/ui";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { commonQueries } from "@shared/query/common/queries";
import { useAlertStore } from "@shared/store/useAlertStore";
import type { SearchParm } from "../../types";
import ConditionPanel, { type ConditionPanelItem } from "../ConditionPanel";

interface SaveModalProps extends ModalProps {
  menuCode?: string;
  parms?: SearchParm[];
}

const toConditionItems = (parms: SearchParm[]): ConditionPanelItem[] =>
  parms.map((p) => ({
    id: p.id,
    label: p.value ? `${p.label}: ${p.value}` : p.label,
    condition: p.condition,
  }));

const SaveModal = ({ open, onOpenChange, onSuccess, menuCode = "", parms = [] }: SaveModalProps) => {
  const [conditionName, setConditionName] = useState("");
  const { openAlert } = useAlertStore();
  const { mutate: save, isPending } = useMutation(commonQueries.saveSearchCondition());

  const handleSave = () => {
    if (!conditionName.trim()) {
      openAlert({ message: "조건명을 입력하세요." });
      return;
    }

    const toAndOrNOT = (condition: string) => condition === "exclusion" ? "NOT" : "AND";

    const searchOptions = Object.fromEntries(
      parms.filter((p) => p.type === "default").map((p) => [p.cateCode, p.valueCode ?? p.value])
    );

    const dateFilters = parms
      .filter((p) => p.type === "date")
      .map((p) => ({ type: p.cateCode, startDate: p.fromValue ?? "", endDate: p.toValue ?? "", andOrNOT: toAndOrNOT(p.condition) }));

    const textFilters = parms
      .filter((p) => p.type === "string")
      .map((p) => ({ type: p.cateCode, value: p.valueCode ?? p.value, andOrNOT: toAndOrNOT(p.condition) }));

    save(
      { menuCode, conditionName, searchOptions, dateFilters, textFilters },
      {
        onSuccess: () => {
          openAlert({ message: "검색 조건이 저장되었습니다." });
          setConditionName("");
          onOpenChange(false);
          onSuccess?.(undefined);
        },
        onError: () => openAlert({ message: "저장에 실패했습니다." }),
      }
    );
  };

  return (
    <FormDialog
      title="검색조건 저장"
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSave}
      submitText="저장"
      submitLoading={isPending}
      className="sm:max-w-[700px]"
    >
      <div className="flex gap-0 overflow-hidden rounded-md border">
        {/* Left: 조건명 입력 */}
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">조건명</label>
            <Input
              autoFocus
              value={conditionName}
              onChange={(e) => setConditionName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
              placeholder="저장할 조건명을 입력하세요"
            />
          </div>
          {parms.length === 0 && (
            <p className="text-xs text-muted-foreground">
              조건이 없습니다. 검색조건을 설정한 후 저장하세요.
            </p>
          )}
        </div>

        {/* Right: 저장될 조건 미리보기 */}
        <div className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 w-60 flex-none border-l">
          <ConditionPanel
            items={toConditionItems(parms)}
            emptyText="저장될 조건이 없습니다."
          />
        </div>
      </div>
    </FormDialog>
  );
};

export default SaveModal;
