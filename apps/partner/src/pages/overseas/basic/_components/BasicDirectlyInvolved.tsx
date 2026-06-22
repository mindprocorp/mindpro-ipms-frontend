import { Button, CustomTooltip, Icons, RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { OverseasBasicCreateRequest } from "@shared/api/overseas/basicApi.ts";
import type { OverseasBasicFormInput } from "@shared/schema/overseas/basicSchema.ts";
import React, { useEffect, useRef } from "react";
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

const DirectlyInvolved = () => {
  const { control, setValue } = useFormContext<OverseasBasicFormInput>();

  const [isUserOpenModal, setIsUserOpenModal] = React.useState(false);
  const [inputKeyInfo, setInputKeyInfo] = React.useState<InputKeyInfoType>({
    inputKey: "",
    inputName: "",
  });

  // [신규] 고객 카테고리(의뢰인/출원인/발명자/해외대리인) 단일 선택 모달
  const [cstModal, setCstModal] = React.useState<{
    open: boolean;
    category: CustomerCategory;
    inputKey: string;
    inputName: string;
  }>({ open: false, category: "client", inputKey: "", inputName: "" });

  // 의뢰인 - 배열
  const {
    fields: clientFields,
    append: appendClient,
    remove: removeClient,
  } = useFieldArray({
    control,
    name: "appCounterPartyInfo.clientInfo",
  });

  // 출원인 - 배열
  const {
    fields: applicantFields,
    append: appendApplicant,
    remove: removeApplicant,
  } = useFieldArray({
    control,
    name: "appCounterPartyInfo.applicantInfo",
  });

  // 등록권리자 - 배열
  const {
    fields: regMgrFields,
    append: appendRegMgr,
    remove: removeRegMgr,
  } = useFieldArray({
    control,
    name: "appCounterPartyInfo.regMgrInfo",
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
      <FormUnitBox vertical boxfull title="당사자 정보">
        {/* 의뢰인 - 배열 */}
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
                  {index > 0 && (
                    <Button className="w-5" onClick={() => removeClient(index)}>
                      <Icons.Trash className="size-3" />
                    </Button>
                  )}
                </>
              }
              inputDisabled
              maxLength={100}
            />
            <RHF.Input
              control={control}
              name={`appCounterPartyInfo.clientInfo.${index}.counterPartySeq`}
              type="hidden"
            />
          </React.Fragment>
        ))}
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
          label="의뢰인 담당자"
          important
          inputDisabled
          maxLength={100}
        />

        <RHF.Input
          control={control}
          name="appCounterPartyInfo.clientContactInfo.userSeq"
          type={"hidden"}
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
                  {index > 0 && (
                    <Button className="w-5" onClick={() => removeApplicant(index)}>
                      <Icons.Trash className="size-3" />
                    </Button>
                  )}
                </>
              }
              inputDisabled
              maxLength={100}
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

        <RHF.Input
          control={control}
          name="appCounterPartyInfo.inventorInfo.userName"
          label="창작자"
          important
          actions={
            <>
              <CustomTooltip message="선택하거나 입력 하세요">
                <Button
                  className="w-5"
                  onClick={() =>
                    onClickCstModal(
                      "inventor",
                      "appCounterPartyInfo.inventorInfo.userSeq",
                      "appCounterPartyInfo.inventorInfo.userName",
                    )
                  }
                >
                  <Icons.Search className="size-3" />
                </Button>
              </CustomTooltip>
            </>
          }
          inputDisabled
          maxLength={100}
        />
        <RHF.Input
          control={control}
          name="appCounterPartyInfo.inventorInfo.userSeq"
          type={"hidden"}
        />

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
                  {index > 0 && (
                    <Button className="w-5" onClick={() => removeRegMgr(index)}>
                      <Icons.Trash className="size-3" />
                    </Button>
                  )}
                </>
              }
              inputDisabled
              maxLength={100}
            />
            <RHF.Input
              control={control}
              name={`appCounterPartyInfo.regMgrInfo.${index}.counterPartySeq`}
              type="hidden"
            />
          </React.Fragment>
        ))}
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

export default DirectlyInvolved;
