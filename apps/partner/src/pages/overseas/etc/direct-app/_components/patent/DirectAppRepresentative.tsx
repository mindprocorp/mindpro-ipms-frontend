import { Button, CustomTooltip, Icons, RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";
import type { OverseasDirectAppFormInput } from "@shared/schema/overseas/directAppSchema.ts";
import {
  type InputKeyInfoType,
  type SuccessData,
  UserModal,
} from "@pages/common/modal/user/UserModal.tsx";
import React, { useState } from "react";

const OverseasRepresentative = () => {
  const { control, setValue } = useFormContext<OverseasDirectAppFormInput>();
  const [isUserOpenModal, setIsUserOpenModal] = React.useState(false);
  const [inputKeyInfo, setInputKeyInfo] = React.useState<InputKeyInfoType>({
    inputKey : '',
    inputName : '',
  });


  const onOpenChange = (isOpen : boolean) => {
    setIsUserOpenModal(isOpen);
  }

  const onClickUserModal = (inputKey: string, inputName: string) => {
    setIsUserOpenModal(true);
    setInputKeyInfo({
      inputKey,
      inputName,
    });
  }

  const onSuccess = (rtnData: SuccessData) => {
    const user = rtnData.userInfo[0];
    setValue(rtnData.input.inputKey as any, user.id, { shouldValidate: true });
    setValue(rtnData.input.inputName as any, user.name, { shouldValidate: true });
    if (user.deptCode && rtnData.input.inputKey.includes("adminMgrInfo")) {
      setValue("appManagerInfo.deptCode" as any, user.deptCode.substring(0, 30), { shouldValidate: true });
    }
  }

  return (
    <>
      <FormUnitBox vertical title="담당 정보">
        <RHF.FormField gap={2}>
          <RHF.Input
            control={control}
            name="appManagerInfo.deptCode"
            label="부서"
            placeholder="담당자 선택 시 자동 입력"
            inputDisabled
            maxLength={30}
          />

          <RHF.Input
            control={control}
            name="appManagerInfo.adminMgrInfo.userName"
            label="관리담당자"
            actions={
              <>
                <CustomTooltip message="선택하거나 입력 하세요">
                  <Button
                    className="w-5"
                    onClick={() =>
                      onClickUserModal(
                        "appManagerInfo.adminMgrInfo.userSeq",
                        "appManagerInfo.adminMgrInfo.userName",
                      )
                    }
                  >
                    <Icons.Search className="size-3" />
                  </Button>
                </CustomTooltip>
              </>
            }
            placeholder="선택 또는 입력"
            inputDisabled
            maxLength={100}
          />

          <RHF.Input control={control} name="appManagerInfo.adminMgrInfo.userSeq" type={"hidden"} />
        </RHF.FormField>

        <RHF.FormField gap={2}>
          <RHF.Input
            control={control}
            name="appManagerInfo.caseMgrInfo.userName"
            label="사건담당자"
            actions={
              <>
                <CustomTooltip message="선택하거나 입력 하세요">
                  <Button
                    className="w-5"
                    onClick={() =>
                      onClickUserModal(
                        "appManagerInfo.caseMgrInfo.userSeq",
                        "appManagerInfo.caseMgrInfo.userName",
                      )
                    }
                  >
                    <Icons.Search className="size-3" />
                  </Button>
                </CustomTooltip>
              </>
            }
            placeholder="선택 또는 입력"
            inputDisabled
            maxLength={100}
          />
          <RHF.Input
            control={control}
            name="appManagerInfo.caseMgrInfo.userSeq"
            label="사건담당자"
            type={"hidden"}
            placeholder="선택 또는 입력"
          />

          <RHF.Input
            control={control}
            name="appManagerInfo.attorneyInfo.userName"
            label="담당변리사"
            actions={
              <>
                <CustomTooltip message="선택하거나 입력 하세요">
                  <Button
                    className="w-5"
                    onClick={() =>
                      onClickUserModal(
                        "appManagerInfo.attorneyInfo.userSeq",
                        "appManagerInfo.attorneyInfo.userName",
                      )
                    }
                  >
                    <Icons.Search className="size-3" />
                  </Button>
                </CustomTooltip>
              </>
            }
            placeholder="선택 또는 입력"
            inputDisabled
            maxLength={100}
          />

          <RHF.Input
            control={control}
            name="appManagerInfo.attorneyInfo.userSeq"
            label="사건담당자"
            type={"hidden"}
            placeholder="선택 또는 입력"
          />
        </RHF.FormField>
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

export default OverseasRepresentative;
