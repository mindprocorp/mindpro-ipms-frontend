import { FlexBox, RHF } from "@repo/ui";
import { useFormContext, type FieldValues } from "react-hook-form";

const SearchScope = <T extends FieldValues>() => {
  const { control } = useFormContext();
  return (
    <div className="border-slate-200 dark:border-input bg-white dark:bg-slate-900 border-b px-4 py-1.5">
      <FlexBox>
        <h2 className="pr-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide whitespace-nowrap">검색범위</h2>
        <RHF.FormCheckboxGroup
          control={control}
          size="sm"
          name={"tabConditions" as any}
          items={[
            { label: "국내출원 포함", value: "scopeDomestic" },
            { label: "해외출원 포함", value: "scopeOverseas" },
            { label: "이의심판 포함", value: "scopeConflict" },
            { label: "기타사건 포함", value: "scopeEtc" },
            { label: "위임장미제출 포함", value: "scopeNoPoa" },
            { label: "절차계속신청서 및 의견서제출마감 포함(국내 상표건만 적용)", value: "scopeContinuation" },
          ]}
        />
      </FlexBox>
    </div>
  );
};

export default SearchScope;
