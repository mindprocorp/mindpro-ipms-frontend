import { data, TestSchema, type TestData, type TestFormInput } from "../../../../pages/pub/schema";
import {
  Button, CustomTooltip,
  DataTable,
  FlexBox,
  FormDialog,
  getColumns,
  GN,
  Icons,
  RHF,
  Separator,
} from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import { columnsData } from "./columns/BillDistributeAddItemCol";
import React, { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type DistributeFormInput,
  type DistributeFormOutput,
  DistributeSchema,
} from "@shared/schema/bill/modal/distributeSchema.ts";
import {
  useDistibuteModalForm,
  useFileListModalForm,
} from "@shared/schema/common/modal/modalform.ts";
import type { CodeRequestTypeNew, CodeSelectOption } from "@shared/api/common/commApi.ts";
import { DISTRIBUTE, FILE_LIST } from "@shared/enum/comCodeType.ts";
import { getCodeList } from "@shared/util/codeUtils.ts";
import { mapToOptionNew } from "@shared/util/stringUtil.ts";
import { useMutation } from "@tanstack/react-query";
import { commonQueries } from "@shared/query/common/queries.ts";
import {
  type InputKeyInfoType,
  type SuccessData,
  UserModal,
} from "@pages/common/modal/user/UserModal.tsx";

export const DistribteAddItem = ({
  title,
  open,
  onOpenChange,
  onSuccess,
  editData,
}: ModalProps & { editData?: any }) => {
  const form = useDistibuteModalForm();
  const getCommonCodeNewMutation = useMutation(commonQueries.getCommonCodeNew());
  const [isUserOpenModal, setIsUserOpenModal] = React.useState(false);
  const [inputKeyInfo, setInputKeyInfo] = React.useState<InputKeyInfoType>({
    inputKey: "",
    inputName: "",
  });
  const [performanceType, setPerformanceType] = useState<CodeSelectOption[]>([]);

  const onClickUserModal = (inputKey: string, inputName: string) => {
    setIsUserOpenModal(true);
    setInputKeyInfo({
      inputKey,
      inputName,
    });
  };

  const getCommCodeNew = useCallback(() => {
    const codeRequest: CodeRequestTypeNew = {
      grpCdList: [DISTRIBUTE.PERFORMANCE_TYPE],
    };

    getCommonCodeNewMutation.mutate(codeRequest, {
      onSuccess: (response) => {
        console.log("code list ", response);

        const codeDataList = response.data;

        const setupCodes = (codeKey: string, setter: (codes: any[]) => void) => {
          const codeList = getCodeList(codeKey, codeDataList);
          setter(mapToOptionNew(codeList));
        };
        setupCodes(DISTRIBUTE.PERFORMANCE_TYPE, setPerformanceType);
      },
    });
  }, [open]);

  useEffect(() => {
    getCommCodeNew();
    if (editData) {
      form.reset(editData);
    } else {
      form.reset();
    }
  }, [getCommCodeNew, editData]);

  // performanceType, form 사용 가능한 위치에 추가
  const performanceCategoryCode = useWatch({
    control: form.control,
    name: "performanceCategory.code",
  });

  useEffect(() => {
    if (!performanceCategoryCode) return;

    const selectedLabel =
      performanceType.find((item) => item.value === performanceCategoryCode)?.label ?? "";

    form.setValue("performanceCategory.codeName", selectedLabel); // label 저장
  }, [performanceCategoryCode, performanceType]);

  const onModalSuccess = (rtnData: SuccessData) => {
    const user = rtnData.userInfo[0];
    form.setValue(rtnData.input.inputKey as any, user.id, { shouldValidate: true });
    form.setValue(rtnData.input.inputName as any, user.name, { shouldValidate: true });
    // 담당자(staff) 선택 시 부서 자동 매핑 (이의심판 Representative.tsx 패턴 동일 적용)
    if (user.deptCode && rtnData.input.inputKey.includes("staff")) {
      form.setValue("deptCategory" as any, user.deptCode, { shouldValidate: true });
    }
  };

  const onModalOpenChange = (isOpen: boolean) => {
    setIsUserOpenModal(isOpen);
  };

  const onSubmit = (values: DistributeFormInput) => {
    console.log("클릭이요");
    const resultValue: DistributeFormOutput = DistributeSchema.parse(values);

    onOpenChange(false);
    onSuccess?.(resultValue as any);
  };

  const onError = (errors: any) => {
    console.log(" Zod errors:", errors);
  };

  return (
    <>
      <FormProvider {...form}>
        <FormDialog
          title={title}
          onSubmit={form.handleSubmit(onSubmit, onError)}
          submitText="저장"
          open={open}
          onOpenChange={onOpenChange}
          className="max-w-100!"
        >
          <FlexBox vertical>
            <FlexBox>
              <RHF.Input
                control={form.control}
                name="staff.userName"
                label="담당자"
                actions={
                  <>
                    <CustomTooltip message="선택하거나 입력 하세요">
                      <Button
                        className="w-5"
                        onClick={() => onClickUserModal("staff.userSeq", "staff.userName")}
                      >
                        <Icons.Search className="size-3" />
                      </Button>
                    </CustomTooltip>
                  </>
                }
                inputDisabled
              />

              <RHF.Input control={form.control} name="staff.userSeq" type={"hidden"} />

              <RHF.Input control={form.control} name="deptCategory" label="부서" disabled />
            </FlexBox>

            <FlexBox>
              <RHF.FormSelect
                control={form.control}
                name="performanceCategory.code"
                items={performanceType}
                label="실적구분"
              />

              {/* label hidden 필드 추가 */}
              <RHF.Input control={form.control} name="performanceCategory.codeName" type="hidden" />

              <RHF.Input
                control={form.control}
                name="shareRatio"
                label="기여율(%)"
                percentOnly
                align="right"
              />
            </FlexBox>

            <FlexBox>
              <RHF.FormDatePicker
                control={form.control}
                name="performancePerfDate"
                label="실적인정일자"
              />
              <RHF.Input
                control={form.control}
                name="performanceAmount"
                label="실적"
                priceOnly
                decimalOnly
                align="right"
              />
            </FlexBox>

            <RHF.FormTextarea control={form.control} name="note" label="비고" />
          </FlexBox>
        </FormDialog>
      </FormProvider>

      <UserModal
        open={isUserOpenModal}
        onOpenChange={onModalOpenChange}
        title="담당자 선택"
        input={inputKeyInfo}
        onSuccess={onModalSuccess}
      />
    </>
  );
};;
