import { Button, CustomTooltip, Icons, RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { DomesticFormInput } from "@shared/schema/domestic/domesticSchema.ts";

import {
  type InputKeyInfoType,
  type SuccessData,
  UserModal,
} from "@pages/common/modal/user/UserModal.tsx";
import {
  CustomerSelectModal,
  type CustomerCategory,
  type CustomerSelected,
} from "@pages/common/modal/customer/CustomerSelectModal.tsx";

import React, { useEffect, useRef } from "react";



const TradeMarkDirectlyInvolved = () => {
  const { control, setValue } = useFormContext<DomesticFormInput>();

  const [isUserOpenModal, setIsUserOpenModal] = React.useState(false);
  const [inputKeyInfo, setInputKeyInfo] = React.useState<InputKeyInfoType>({
    inputKey: "",
    inputName: "",
  });
  const [cstModal, setCstModal] = React.useState<{ open: boolean; category: CustomerCategory; inputKey: string; inputName: string }>({
    open: false, category: "client", inputKey: "", inputName: "",
  });

  const {
    fields: clientFields,
    append: appendClient,
    remove: removeClient,
  } = useFieldArray({
    control,
    name: "appCounterPartyInfo.clientInfo",
  });

  const {
    fields: regMgrFields,
    append: appendRegMgr,
    remove: removeRegMgr,
  } = useFieldArray({
    control,
    name: "appCounterPartyInfo.regMgrInfo",
  });

  // applicantInfo useFieldArray 추가
  const {
    fields: applicantFields,
    append: appendApplicant,
    remove: removeApplicant,
  } = useFieldArray({
    control,
    name: "appCounterPartyInfo.applicantInfo",
  });

  // Strict Mode에서 useEffect가 두 번 실행되는 것을 방지
  const initRef = useRef(false);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    if (clientFields.length === 0) appendClient({ counterPartySeq: "", counterPartyName: "" });
    if (applicantFields.length === 0) appendApplicant({ counterPartySeq: "", counterPartyName: "" });
    if (regMgrFields.length === 0) appendRegMgr({ counterPartySeq: "", counterPartyName: "" });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const onClickCstModal = (category: CustomerCategory, inputKey: string, inputName: string) =>
    setCstModal({ open: true, category, inputKey, inputName });
  const onCstSelect = (item: CustomerSelected) => {
    setValue(cstModal.inputKey as any,  item.customerSeq,  { shouldValidate: true, shouldDirty: true });
    setValue(cstModal.inputName as any, item.customerName, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <>
      <FormUnitBox vertical title="당사자 정보">
        {clientFields.map((field, index) => (
          <React.Fragment key={field.id}>
            <RHF.Input
              control={control}
              name={`appCounterPartyInfo.clientInfo.${index}.counterPartyName`}
              label={index === 0 ? "의뢰인" : `의뢰인 ${index + 1}`}
              important={index === 0}
              actions={
                <>
                  <CustomTooltip message="선택하거나 입력 하세요">
                    <Button
                      className="w-5"
                      onClick={() =>
                        onClickCstModal(
                          "client",
                          `appCounterPartyInfo.clientInfo.${index}.counterPartySeq`,
                          `appCounterPartyInfo.clientInfo.${index}.counterPartyName`,
                        )
                      }
                    >
                      <Icons.Search className="size-3" />
                    </Button>
                  </CustomTooltip>
                  {clientFields.length > 1 && (
                    <Button className="w-5" onClick={() => removeClient(index)}>
                      <Icons.Trash className="size-3" />
                    </Button>
                  )}
                </>
              }
              placeholder="선택"
               inputDisabled
            />
            <RHF.Input
              control={control}
              name={`appCounterPartyInfo.clientInfo.${index}.counterPartySeq`}
              type="hidden"
            />
          </React.Fragment>
        ))}
        {/* 의뢰인 추가 버튼 */}
        <Button
          size="h28"
          variant="outline"
          onClick={() => appendClient({ counterPartySeq: "", counterPartyName: "" })}
        >
          <Icons.Plus className="size-3" /> 의뢰인 추가
        </Button>

        <RHF.Input
          control={control}
          name="appCounterPartyInfo.clientContactInfo.userName"
          label="의뢰인 담당자"
          important
          actions={
            <>
              <CustomTooltip message="선택하거나 입력 하세요">
                <Button
                  className="w-5"
                  onClick={() =>
                    onClickUserModal(
                      "appCounterPartyInfo.clientContactInfo.userSeq",
                      "appCounterPartyInfo.clientContactInfo.userName",
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

        {/* 출원인 - 배열 */}
        {applicantFields.map((field, index) => (
          <React.Fragment key={field.id}>
            <RHF.Input
              control={control}
              name={`appCounterPartyInfo.applicantInfo.${index}.counterPartyName`}
              label={index === 0 ? "출원인" : `출원인 ${index + 1}`}
              important={index === 0}
              actions={
                <>
                  <CustomTooltip message="선택하거나 입력 하세요">
                    <Button
                      className="w-5"
                      onClick={() =>
                        onClickCstModal(
                          "applicant",
                          `appCounterPartyInfo.applicantInfo.${index}.counterPartySeq`,
                          `appCounterPartyInfo.applicantInfo.${index}.counterPartyName`,
                        )
                      }
                    >
                      <Icons.Search className="size-3" />
                    </Button>
                  </CustomTooltip>
                  {applicantFields.length > 1 && (
                    <Button className="w-5" onClick={() => removeApplicant(index)}>
                      <Icons.Trash className="size-3" />
                    </Button>
                  )}
                </>
              }
              placeholder="선택"
               inputDisabled
            />
            <RHF.Input
              control={control}
              name={`appCounterPartyInfo.applicantInfo.${index}.counterPartySeq`}
              type="hidden"
            />
          </React.Fragment>
        ))}
        <Button
          size="h28"
          variant="outline"
          onClick={() => appendApplicant({ counterPartySeq: "", counterPartyName: "" })}
        >
          <Icons.Plus className="size-3" /> 출원인 추가
        </Button>

        {/* 등록권리자 - 배열 */}
        {regMgrFields.map((field, index) => (
          <React.Fragment key={field.id}>
            <RHF.Input
              control={control}
              name={`appCounterPartyInfo.regMgrInfo.${index}.counterPartyName`}
              label={index === 0 ? "등록권리자" : `등록권리자 ${index + 1}`}
              important={index === 0}
              actions={
                <>
                  <CustomTooltip message="선택하거나 입력 하세요">
                    <Button
                      className="w-5"
                      onClick={() =>
                        onClickUserModal(
                          `appCounterPartyInfo.regMgrInfo.${index}.counterPartySeq`,
                          `appCounterPartyInfo.regMgrInfo.${index}.counterPartyName`,
                        )
                      }
                    >
                      <Icons.Search className="size-3" />
                    </Button>
                  </CustomTooltip>
                  {regMgrFields.length > 1 && (
                    <Button className="w-5" onClick={() => removeRegMgr(index)}>
                      <Icons.Trash className="size-3" />
                    </Button>
                  )}
                </>
              }
              placeholder="선택"
               inputDisabled
            />
            <RHF.Input
              control={control}
              name={`appCounterPartyInfo.regMgrInfo.${index}.counterPartySeq`}
              type="hidden"
            />
          </React.Fragment>
        ))}
        {/* 등록권리자 추가 버튼 */}
        <Button
          size="h28"
          variant="outline"
          onClick={() => appendRegMgr({ counterPartySeq: "", counterPartyName: "" })}
        >
          <Icons.Plus className="size-3" /> 등록권리자 추가
        </Button>
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

export default TradeMarkDirectlyInvolved;
