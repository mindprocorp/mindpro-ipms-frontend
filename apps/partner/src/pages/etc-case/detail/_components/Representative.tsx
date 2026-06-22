import { type EtcCaseFormInput } from "@shared/schema/etc-case/etcCaseSchema.ts";
import { Button, CustomTooltip, Icons, RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext, type Path } from "react-hook-form";
import { useState } from "react";
import {
  type InputKeyInfoType,
  type SuccessData,
  UserModal,
} from "@pages/common/modal/user/UserModal";

const Representative = () => {
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
    const user = rtnData.userInfo[0];
    setValue(rtnData.input.inputKey as Path<EtcCaseFormInput>, user.id, { shouldValidate: true });
    setValue(rtnData.input.inputName as Path<EtcCaseFormInput>, user.name, { shouldValidate: true });
    // 부서는 '관리담당자(adminMgr)' 선택 시에만 자동 세팅
    if (user.deptCode && rtnData.input.inputKey.includes("adminMgr")) {
      setValue("cftManagerInfo.deptName", user.deptCode, { shouldValidate: true });
    }
  };

  return (
    <>
      <FormUnitBox vertical title="담당 정보">
        <RHF.FormField gap={2}>
          <RHF.Input control={control} name="cftManagerInfo.deptName" label="부서" placeholder="선택" inputDisabled />
          <RHF.Input
            control={control}
            name="cftManagerInfo.adminMgr.userName"
            label="관리담당자"
            actions={
              <>
                <CustomTooltip message="선택하거나 입력 하세요">
                  <Button
                    className="w-5"
                    onClick={() =>
                      onClickUserModal(
                        "cftManagerInfo.adminMgr.userSeq",
                        "cftManagerInfo.adminMgr.userName",
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
          <RHF.Input
            control={control}
            name="cftManagerInfo.adminMgr.userSeq"
            type={"hidden"}
          />
        </RHF.FormField>
        <RHF.FormField gap={2}>
          <RHF.Input
            control={control}
            name="cftManagerInfo.caseMgr.userName"
            label="사건담당자"
            actions={
              <>
                <CustomTooltip message="선택하거나 입력 하세요">
                  <Button
                    className="w-5"
                    onClick={() =>
                      onClickUserModal(
                        "cftManagerInfo.caseMgr.userSeq",
                        "cftManagerInfo.caseMgr.userName",
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
          <RHF.Input
            control={control}
            name="cftManagerInfo.caseMgr.userSeq"
            type={"hidden"}
          />

          <RHF.Input
            control={control}
            name="cftManagerInfo.attorney.userName"
            label="담당변리사"
            actions={
              <>
                <CustomTooltip message="선택하거나 입력 하세요">
                  <Button
                    className="w-5"
                    onClick={() =>
                      onClickUserModal(
                        "cftManagerInfo.attorney.userSeq",
                        "cftManagerInfo.attorney.userName",
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
          <RHF.Input
            control={control}
            name="cftManagerInfo.attorney.userSeq"
            type={"hidden"}
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

export default Representative;
