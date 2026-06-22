import { type EtcCaseFormInput } from "@shared/schema/etc-case/etcCaseSchema.ts";
import { Button, CustomTooltip, FlexBox, Icons, RHF, Separator } from "@repo/ui";
import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext, type Path } from "react-hook-form";
import {
  type InputKeyInfoType,
  type SuccessData,
  UserModal,
} from "@pages/common/modal/user/UserModal";
import { useState } from "react";

const CaseInfo = () => {
  const { control, setValue } = useFormContext<EtcCaseFormInput>();
  const [isUserOpenModal, setIsUserOpenModal] = useState(false);
  const [inputKeyInfo, setInputKeyInfo] = useState<InputKeyInfoType>({
    inputKey: "",
    inputName: "",
  });

  const onOpenChange = (isOpen: boolean) => {
    setIsUserOpenModal(isOpen);
  };

  const onClickUserModal = (inputKey: string, inputName: string) => {
    setIsUserOpenModal(true);
    setInputKeyInfo({
      inputKey,
      inputName,
    });
  };

  const onSuccess = (rtnData: SuccessData) => {
    setValue(rtnData.input.inputKey as Path<EtcCaseFormInput>, rtnData.userInfo[0].id, { shouldValidate: true });
    setValue(rtnData.input.inputName as Path<EtcCaseFormInput>, rtnData.userInfo[0].name, { shouldValidate: true });
  };

  return (
    <>
      <FormUnitBox
        vertical
        boxfull
        title="사건정보"
        className="[&>div>h2]:text-p-color-3 [&>div]:first-of-type:bg-p-color-3/5"
      >
        <RHF.Input
          control={control}
          name="cftLitigantInfo.caseTitleKo"
          label="사건명"
          className="[&>div]:max-w-[calc(100%-80px)]"
          orientation="horizontal"
          maxLength={255}
        />

        <RHF.Input
          control={control}
          name="cftLitigantInfo.introducer"
          label="소개자"
          className="[&>div]:max-w-[calc(100%-80px)]"
          orientation="horizontal"
          maxLength={30}
        />

        <Separator className="my-2 border-t" />

        <FlexBox className="[&>div]:flex-1">
          <UnitInnerBox>
            <FlexBox className="justify-between">
              <BoxTitle title="의뢰인" />
              <FlexBox className="flex-0 [&>div]:justify-end [&>div]:gap-2 [&>div>div]:min-h-8">
                <RHF.FormRadio
                  control={control}
                  name="cftLitigantInfo.petitionerType"
                  items={[
                    { value: "Y", label: "원고" },
                    { value: "N", label: "피고" },
                  ]}
                  height={7}
                  size="sm"
                />
              </FlexBox>
            </FlexBox>
            <RHF.FormField gap={2} vertical>
              <RHF.Input
                control={control}
                name="cftLitigantInfo.petitioner.userName"
                actions={
                  <>
                    <CustomTooltip message="선택해주세요">
                      <Button
                        className="w-5"
                        onClick={() =>
                          onClickUserModal(
                            "cftLitigantInfo.petitioner.userSeq",
                            "cftLitigantInfo.petitioner.userName",
                          )
                        }
                      >
                        <Icons.Search className="size-3" />
                      </Button>
                    </CustomTooltip>
                  </>
                }
                placeholder="선택"
                inputDisabled
              />
              <RHF.Input control={control} name="cftLitigantInfo.petitioner.userSeq" type={"hidden"} />
              <RHF.FormTextarea control={control} name="cftLitigantInfo.petitionerMemo" label="메모" className="w-full" maxLength={2000} />
            </RHF.FormField>
          </UnitInnerBox>

          <UnitInnerBox className="bg-info-bg">
            <FlexBox className="justify-between">
              <BoxTitle title="상대방" />
              <FlexBox className="flex-0 [&>div]:justify-end [&>div]:gap-2 [&>div>div]:min-h-8">
                <RHF.FormRadio
                  control={control}
                  name="cftLitigantInfo.respondentType"
                  items={[
                    { value: "Y", label: "원고" },
                    { value: "N", label: "피고" },
                  ]}
                  height={7}
                  size="sm"
                />
              </FlexBox>
            </FlexBox>
            <RHF.FormField gap={2} vertical>
              <RHF.Input control={control} name="cftLitigantInfo.respondent" maxLength={30} />
              <RHF.FormTextarea control={control} name="cftLitigantInfo.respondentMemo" label="메모" className="w-full" maxLength={2000} />
            </RHF.FormField>
          </UnitInnerBox>
        </FlexBox>
      </FormUnitBox>

      <UserModal
        open={isUserOpenModal}
        onOpenChange={onOpenChange}
        title="담당자 선택"
        input={inputKeyInfo}
        onSuccess={onSuccess}
      />
    </>
  );
};

export default CaseInfo;
