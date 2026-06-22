import { FlexBox, RHF, Icons } from "@repo/ui";
import { type FieldValues, type Path, useFormContext } from "react-hook-form";

const SearchUseQuick = <T extends FieldValues>() => {
  const { control } = useFormContext();
  return (
    <div className="border-border-100 dark:border-input justify-between border-t px-4 py-2">
      <FlexBox>
        <RHF.FormField>
          <RHF.Input
            control={control}
            orientation="horizontal"
            size="h28"
            name={"searchNum" as Path<T>}
            label="번호검색"
            labelStyle="text-xs"
            suffix={<Icons.Search />}
            placeholder="번호입력"
          />
          <RHF.Input
            control={control}
            orientation="horizontal"
            size="h28"
            name={"searchName" as Path<T>}
            label="인명검색"
            labelStyle="text-xs"
            suffix={<Icons.Search />}
            placeholder="인명입력"
          />
        </RHF.FormField>
        <RHF.FormCheckboxGroup
          control={control}
          size="sm"
          name={"tabConditions"}
          items={[
            { label: "상태 탭 건수표시", value: "condiCount" },
            { label: "결과(탭)내 검색", value: "condiInSearch" },
            { label: "이미지 보기", value: "condiImage" },
          ]}
        />
      </FlexBox>

      {/* <Form.FormCheckbox
        name={"condiCount" as Path<T>}
        label="라디오처럼YN"
        outputFormat={["Y", "N"]}
      />
      <Form.FormCheckboxGroup name={"tabConditions"} items={items} />
      <Form.FormCheckbox size="sm" name={"condiInSearch"} label="상태 탭 건수표시ddd" />
      <Form.FormRadio name={"condiImage"} items={items} label="상태 탭 건수표시" />
      <Form.FormSelect name={"testparms"} items={frameworks} label="상태 탭 건수표시" /> */}
    </div>
  );
};

export default SearchUseQuick;
