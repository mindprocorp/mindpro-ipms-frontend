import { Button, CustomTooltip, Icons, RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext,useWatch } from "react-hook-form";
import type { CodeSelectOption } from "@shared/api/common/commApi.ts";
import React, { useEffect } from "react";
import type { OverseasBasicCreateRequest } from "@shared/api/overseas/basicApi.ts";
import type { OverseasBasicFormInput } from "@shared/schema/overseas/basicSchema.ts";
import {
  type InputKeyInfoType,
  type SuccessData,
  UserModal,
} from "@pages/common/modal/user/UserModal.tsx";

interface CodeListType {
  rightCodeList: CodeSelectOption[];
  appCodeList: CodeSelectOption[];
  cateCodeList: CodeSelectOption[];
  appKindCodeList: CodeSelectOption[];
}


const BasicDefaultInfo = (codeList: CodeListType) => {
  const { control ,setValue } = useFormContext<OverseasBasicFormInput>();
  const [isUserOpenModal, setIsUserOpenModal] = React.useState(false);
  const [inputKeyInfo, setInputKeyInfo] = React.useState<InputKeyInfoType>({
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
    console.log(rtnData.userInfo[0].name);
    setValue(rtnData.input.inputKey as any, rtnData.userInfo[0].id, { shouldValidate: true });
    setValue(rtnData.input.inputName as any, rtnData.userInfo[0].name, { shouldValidate: true });
  };



  const rightType = useWatch({
    control,
    name: "appCaseMng.rightType.code",
  });

  useEffect(() => {
    console.log("선택된 권리구분 value:", rightType);
  }, [rightType]);


  return (
    <>
      <FormUnitBox
        title="출원사건관리"
        className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5"
      >
        <RHF.FormSelect
          control={control}
          name="appCaseMng.rightType.code"
          items={codeList.rightCodeList}
          label="권리"
        />
        <RHF.FormSelect
          control={control}
          name="appCaseMng.appType.code"
          items={codeList.appKindCodeList}
          label="출원종류"
        />

        <RHF.Input
          control={control}
          name="appCaseMng.ourRef"
          label="OurRef"
          maxLength={30}
        />
        <RHF.FormDatePicker control={control} name="appCaseMng.receiptDate" label="접수일" />
        <RHF.FormDatePicker
          control={control}
          name="appCaseMng.appCompleteDate"
          label="출원완료일"
        />
        <RHF.Input
          control={control}
          name="appCaseMng.appManagerInfo.userName"
          label="출원담당자"
          maxLength={100}
          actions={
            <>
              <CustomTooltip message="선택하거나 입력 하세요">
                <Button
                  className="w-5"
                  onClick={() =>
                    onClickUserModal(
                      "appCaseMng.appManagerInfo.userSeq",
                      "appCaseMng.appManagerInfo.userName",
                    )
                  }
                >
                  <Icons.Search className="size-3" />
                </Button>
              </CustomTooltip>
            </>
          }
          inputDisabled
        />
        <RHF.Input
          control={control}
          name="appCaseMng.appManagerInfo.userSeq"
          type={"hidden"}
          placeholder="선택 또는 입력"
          maxLength={30}
        />

        <RHF.Input control={control} name="appCaseMng.caseNo" label="사건번호" maxLength={30} />
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

export default BasicDefaultInfo;
