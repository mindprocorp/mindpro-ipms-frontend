import { FlexBox, RHF } from "@repo/ui";
import { useFormContext, type FieldValues } from "react-hook-form";

const SearchCaseClass = <T extends FieldValues>() => {
  const { control } = useFormContext();
  return (
    <div className="border-slate-200 dark:border-input bg-white dark:bg-slate-900 border-b px-4 py-1.5">
      <FlexBox>
        <h2 className="pr-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide whitespace-nowrap">사건구분</h2>
        <RHF.FormCheckboxGroup
          control={control}
          size="sm"
          name={"tabConditions" as any}
          items={[
            { label: "국내", value: "domestic" },
            { label: "해외출원", value: "overseas" },
            { label: "이의심판", value: "conflict" },
            { label: "기타사건", value: "etc" },
            { label: "전자결재", value: "approval" },
            { label: "사건없음", value: "noCase" },
          ]}
        />
      </FlexBox>
    </div>
  );
};

export default SearchCaseClass;
