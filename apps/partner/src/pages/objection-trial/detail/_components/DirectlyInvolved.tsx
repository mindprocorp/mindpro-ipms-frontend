import { type ObjectionTrialFormInput } from "@shared/schema/objection-trial/objectionTrialSchema.ts";
import { Button, CustomTooltip, Icons, RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext, type Path } from "react-hook-form";
import { useState } from "react";
import {
  type InputKeyInfoType,
  type SuccessData,
  UserModal,
} from "@pages/common/modal/user/UserModal";
import { CustomerSelectModal, type CustomerCategory, type CustomerSelected } from "@pages/common/modal/customer/CustomerSelectModal.tsx";

const DirectlyInvolved = () => {
  const { control, setValue } = useFormContext<ObjectionTrialFormInput>();
  const [isUserOpenModal, setIsUserOpenModal] = useState(false);
  const [inputKeyInfo, setInputKeyInfo] = useState<InputKeyInfoType>({
    inputKey: "",
    inputName: "",
  });
  const [cstModal, setCstModal] = useState<{ open: boolean; category: CustomerCategory; inputKey: string; inputName: string }>({
    open: false, category: "client", inputKey: "", inputName: "",
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

  const onClickCstModal = (category: CustomerCategory, inputKey: string, inputName: string) =>
    setCstModal({ open: true, category, inputKey, inputName });
  const onCstSelect = (item: CustomerSelected) => {
    setValue(cstModal.inputKey as Path<ObjectionTrialFormInput>, item.customerSeq, { shouldValidate: true, shouldDirty: true });
    setValue(cstModal.inputName as Path<ObjectionTrialFormInput>, item.customerName, { shouldValidate: true, shouldDirty: true });
  };

  const onSuccess = (rtnData: SuccessData) => {
    setValue(rtnData.input.inputKey as Path<ObjectionTrialFormInput>, rtnData.userInfo[0].id, { shouldValidate: true });
    setValue(rtnData.input.inputName as Path<ObjectionTrialFormInput>, rtnData.userInfo[0].name, { shouldValidate: true });
  };

  return (
    <>
      <FormUnitBox vertical title="당사자 정보">
        <RHF.Input
          control={control}
          name="appPartyInfo.foreignAgent.userName"
          label="해외대리인"
          actions={
            <>
              <CustomTooltip message="선택하거나 입력 하세요">
                <Button
                  className="w-5"
                  onClick={() =>
                    onClickCstModal(
                      "foreignAgent",
                      "appPartyInfo.foreignAgent.userSeq",
                      "appPartyInfo.foreignAgent.userName",
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
          name="appPartyInfo.foreignAgent.userSeq"
          type={"hidden"}
        />

        <RHF.Input
          control={control}
          name="appPartyInfo.client.userName"
          label="의뢰인"
          actions={
            <>
              <CustomTooltip message="선택하거나 입력 하세요">
                <Button
                  className="w-5"
                  onClick={() =>
                    onClickCstModal(
                      "client",
                      "appPartyInfo.client.userSeq",
                      "appPartyInfo.client.userName",
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
          name="appPartyInfo.client.userSeq"
          type={"hidden"}
        />

        <RHF.Input
          control={control}
          name="appPartyInfo.applicant.userName"
          label="출원인"
          actions={
            <>
              <CustomTooltip message="선택하거나 입력 하세요">
                <Button
                  className="w-5"
                  onClick={() =>
                    onClickCstModal(
                      "applicant",
                      "appPartyInfo.applicant.userSeq",
                      "appPartyInfo.applicant.userName",
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
          name="appPartyInfo.applicant.userSeq"
          type={"hidden"}
        />
      </FormUnitBox>

      <UserModal
        open={isUserOpenModal}
        onOpenChange={onOpenChange}
        title="담당자 선택"
        input={inputKeyInfo}
        onSuccess={onSuccess}
      />
      <CustomerSelectModal
        open={cstModal.open}
        onOpenChange={(o) => setCstModal((s) => ({ ...s, open: o }))}
        category={cstModal.category}
        onSelect={onCstSelect}
      />
    </>
  );
};

export default DirectlyInvolved;
