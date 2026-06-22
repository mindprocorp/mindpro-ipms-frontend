import { Button, CustomTooltip, FlexBox, Icons, RHF, Separator } from "@repo/ui";
import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import { frameworks } from "@pages/etc-case/detail/EtcCaseForm.tsx";
import type { CodeSelectOption } from "@shared/api/common/commApi.ts";
import type { DomesticFormInput } from "@shared/schema/domestic/domesticSchema.ts";

interface CodeListType {
  foreignAppTiming: CodeSelectOption[];
};

const Strategy = (codeList: CodeListType) => {
  const { control } = useFormContext<DomesticFormInput>();
  return (
    <FormUnitBox vertical boxfull title="출원 전략설정">
      <RHF.FormField gap={2} name="appStrategy.firstAppInfo" label="최초출원">
        <RHF.FormDatePicker control={control} name="appStrategy.firstAppInfo.firstAppDate" />
        <RHF.Input
          control={control}
          name="appStrategy.firstAppInfo.firstAppNo"
          // label="번호"
          // actions={
          //   <>
          //     <CustomTooltip message="선택하거나 입력 하세요">
          //       <Button className="w-5">
          //         <Icons.Search className="size-3" />
          //       </Button>
          //     </CustomTooltip>
          //   </>
          // }
          krAppNoOnly
          placeholder="번호입력"
        />
      </RHF.FormField>

      <RHF.FormField name="appStrategy.originalAppInfo" gap={2} label="원출원">
        <RHF.FormDatePicker control={control} name="appStrategy.originalAppInfo.originalAppDate" />
        <RHF.Input
          control={control}
          name="appStrategy.originalAppInfo.originalAppNo"
          // actions={
          //   <>
          //     <CustomTooltip message="선택하거나 입력 하세요">
          //       <Button className="w-5">
          //         <Icons.Search className="size-3" />
          //       </Button>
          //     </CustomTooltip>
          //   </>
          // }
          krAppNoOnly
          placeholder="번호입력"
        />
      </RHF.FormField>

      <RHF.FormField gap={2} name="appStrategy.reAppInfo" label="재출원">
        <RHF.FormDatePicker control={control} name="appStrategy.reAppInfo.reAppDate" />
        <RHF.Input
          control={control}
          name="appStrategy.reAppInfo.reAppNo"
          // actions={
          //   <>
          //     <CustomTooltip message="선택하거나 입력 하세요">
          //       <Button className="w-5">
          //         <Icons.Search className="size-3" />
          //       </Button>
          //     </CustomTooltip>
          //   </>
          // }
          krAppNoOnly
          placeholder="번호입력"
        />
      </RHF.FormField>

      <RHF.FormField gap={2} name="appStrategy.dualAppInfo" label="이중출원">
        <RHF.FormDatePicker control={control} name="appStrategy.dualAppInfo.dualAppDate" />
        <RHF.Input
          control={control}
          name="appStrategy.dualAppInfo.dualAppNo"
          // actions={
          //   <>
          //     <CustomTooltip message="선택하거나 입력 하세요">
          //       <Button className="w-5">
          //         <Icons.Search className="size-3" />
          //       </Button>
          //     </CustomTooltip>
          //   </>
          // }
          krAppNoOnly
          placeholder="번호입력"
        />
      </RHF.FormField>

      <RHF.FormField gap={2} name="appStrategy.globalAppInfo" label="국제출원">
        <RHF.FormDatePicker control={control} name="appStrategy.globalAppInfo.globalAppDate" />
        <RHF.Input
          control={control}
          name="appStrategy.globalAppInfo.globalAppNo"
          // actions={
          //   <>
          //     <CustomTooltip message="선택하거나 입력 하세요">
          //       <Button className="w-5">
          //         <Icons.Search className="size-3" />
          //       </Button>
          //     </CustomTooltip>
          //   </>
          // }
          krAppNoOnly
          placeholder="번호입력"
        />
      </RHF.FormField>

      <Separator className="my-2 border-t" />

      <UnitInnerBox>
        <FlexBox className="justify-between">
          <BoxTitle title="해외출원" />
          <FlexBox className="flex-0 [&>div]:justify-end [&>div]:gap-2 [&>div>div]:min-h-8">
            <RHF.FormRadio
              control={control}
              name="appStrategy.isForeignApp"
              items={[
                {
                  value: "Y",
                  label: "예",
                },
                {
                  value: "N",
                  label: "아니오",
                },
              ]}
              height={7}
              size="sm"
            />
            <RHF.FormSelect
              control={control}
              name="appStrategy.foreignAppTiming.code"
              items={codeList.foreignAppTiming}
              placeholder="선택"
            />
          </FlexBox>
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            important
            control={control}
            name="appStrategy.foreign6mDeadline"
            label="6월마감"
          />
          <RHF.FormDatePicker
            important
            control={control}
            name="appStrategy.foreign1yDeadline"
            label="1년마감"
          />
        </RHF.FormField>
        <RHF.FormDatePicker control={control} name="appStrategy.foreignAppDate" label="출원일" />
      </UnitInnerBox>

      <UnitInnerBox className="bg-info-bg">
        <FlexBox>
          <BoxTitle title="청구범위제출" />
        </FlexBox>
        <RHF.FormField gap={2}>
          <RHF.FormDatePicker
            control={control}
            name="appStrategy.claimsNoticeDate"
            label="통지일"
          />
          <RHF.FormDatePicker
            important
            control={control}
            name="appStrategy.claimsDeadline"
            label="마감일"
          />
        </RHF.FormField>
        <RHF.FormDatePicker control={control} name="appStrategy.claimsSubmitDate" label="출원일" />
      </UnitInnerBox>
    </FormUnitBox>
  );
};

export default Strategy;
