import { Button, CustomTooltip, FlexBox, Icons, RHF, Separator } from "@repo/ui";
import { FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext, useWatch } from "react-hook-form";
import { type BillDomesticFormInput } from "@shared/schema/bill/billDomesticSchema.ts";
import type { CodeSelectOption } from "@shared/api/common/commApi.ts";
import React, { useEffect } from "react";
import {
  type InputKeyInfoType,
  type SuccessData,
  UserModal,
} from "@pages/common/modal/user/UserModal.tsx";
import { OurRefModal, type SuccessOurRefData } from "@pages/common/modal/ourref/OurRefModal.tsx";
import { useQuery } from "@tanstack/react-query";
import { customerQueries } from "@shared/query/customer/queries.ts";
import { CustomerSelectModal, type CustomerCategory, type CustomerSelected } from "@pages/common/modal/customer/CustomerSelectModal.tsx";

interface CodeListType {
  invCategoryCodeList: CodeSelectOption[];
  billEventCodeList: CodeSelectOption[];
  invTypeCodeList: CodeSelectOption[];
  customerCodeList: CodeSelectOption[];
}

const DefaultInfo = (codeList: CodeListType) => {
  const { control, setValue } = useFormContext<BillDomesticFormInput>();
  const [isUserOpenModal, setIsUserOpenModal] = React.useState(false);
  const [isOurRefOpenModal, setIsOurRefOpenModal] = React.useState(false);
  const [inputKeyInfo, setInputKeyInfo] = React.useState<InputKeyInfoType>({
    inputKey: "",
    inputName: "",
  });
  const [ourRefInputKeyInfo, setOurRefInputKeyInfo] = React.useState<InputKeyInfoType>({
    inputKey: "",
    inputName: "",
  });

  const [cstModal, setCstModal] = React.useState<{ open: boolean; category: CustomerCategory; inputKey: string }>({
    open: false, category: "client", inputKey: "",
  });

  // 1. 고객사 Seq 실시간 감시
  const currentCustomerSeq = useWatch({
    control,
    name: "customerSeq" as any,
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
    setValue(rtnData.input.inputKey as any, rtnData.userInfo[0].id, { shouldValidate: true });
    setValue(rtnData.input.inputName as any, rtnData.userInfo[0].name, {
      shouldValidate: true,
    });
  };

  const onOurRefOpenChange = (isOpen: boolean) => {
    setIsOurRefOpenModal(isOpen);
  };

  const onClickOurRefModal = (inputKey: string, inputName : string) => {
    setIsOurRefOpenModal(true);
    setOurRefInputKeyInfo({
      inputKey,
      inputName
    });
  };

  const onOurRefSuccess = (rtnData: SuccessOurRefData) => {
    const data = rtnData.ourRefInfo[0] as any;
    console.log('OurRef Data : ', data)
    Object.entries(data).forEach(([key, value]) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // [추가] 고객사 정보는 루트 레벨의 customerSeq, customerName으로 매핑
        if (key === "customer") {
          const customerData = value as any;
          if (customerData.customerSeq) setValue("customerSeq" as any, customerData.customerSeq, { shouldValidate: true, shouldDirty: true });
          if (customerData.customerName) setValue("customerName" as any, customerData.customerName, { shouldValidate: true, shouldDirty: true });
          return;
        }

        Object.entries(value).forEach(([subKey, subValue]) => {
          // [수정] 사건구분(caseCategory)은 청구서 고유값이므로 사건 정보로 덮어쓰지 않음
          if (key === "caseCategory") return;
          // 예: rightType.code, adminMgr.userName 형식으로 자동 생성
          setValue(`${key}.${subKey}` as any, subValue ?? "", { shouldValidate: true, shouldDirty: true });
        });
      } else {
        // 일반 필드 (appNo, titleKo 등) 자동 처리
        let targetKey = key;
        if (key === "independentClaims") targetKey = "finalClaimsCount";
        if (key === "specCount") targetKey = "specPage";
        if (key === "niceClass") targetKey = "productClass";

        // [수정] 만약 스키마에는 문자열인데 넘어온 값이 객체라면 userName 또는 customerName 사용
        if (["applicantName", "clientName"].includes(key)) {
          const nameValue =
            value && typeof value === "object"
              ? (value as any).userName || (value as any).customerName || ""
              : value;
          setValue(targetKey as any, nameValue ?? "", {
            shouldValidate: true,
            shouldDirty: true,
          });
        } else {
          setValue(targetKey as any, value ?? "", {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      }
    });
  };

  const onClickCstModal = (category: CustomerCategory, inputKey: string) =>
    setCstModal({ open: true, category, inputKey });

  const onCstSelect = (item: CustomerSelected) => {
    setValue(cstModal.inputKey as any, item.customerName, { shouldValidate: true, shouldDirty: true });
  };

  // 2. 담당자 목록 조회 쿼리
  const { data: managerOptions = [], isLoading, isFetching } = useQuery({
    queryKey: ["customerManagers", currentCustomerSeq],
    queryFn: async () => {
      console.log("📡 담당자 API 호출 시작 ID:", currentCustomerSeq);
      const options = customerQueries.searchManagerList();
      const payload = {
        tblSeq: currentCustomerSeq,
        page: 1,
        pageSize: 100
      };

      if (options.mutationFn) {
        return options.mutationFn(payload, {} as any);
      }
      return { data: { list: [] } };
    },
    enabled: !!currentCustomerSeq,
    select: (res: any) => {
      const list = res?.data?.list || [];
      return list.map((item: any) => ({
        label: item.userNameKo || item.managerName,
        value: item.userInfoSeq,
      }));
    },
  });

  useEffect(() => {
    setValue("caseCategory.codeName" as any, "내국청구서");
    setValue("caseCategory.code" as any, "60");
  }, []);
  return (
    <>
      <FormUnitBox
        title="청구기본 사항"
        className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5"
        vertical
        boxfull
      >
        <RHF.FormRadio
          control={control}
          label="청구구분"
          name="invCategory.code"
          orientation="horizontal"
          items={codeList.invCategoryCodeList}
          size="sm"
          height={7}
          wrapClassName="justify-start gap-4! [&>h2]:w-auto"
        />

        <Separator className="my-2 border-t" />

        <FlexBox>
          <RHF.Input control={control} name="caseCategory.codeName" label="사건구분" disabled placeholder="" />
          <RHF.FormSelect
            control={control}
            name="invClass.code"
            items={codeList.billEventCodeList}
            label="청구분류"
            ess
          />
          <RHF.FormSelect
            control={control}
            name="invType.code"
            items={codeList.invTypeCodeList}
            label="청구종류"
            ess
          />
          <RHF.FormDatePicker control={control} name="invDate" label="청구일" ess />
          <RHF.Input
            control={control}
            name="invNo"
            label="청구번호"
            ess
            maxLength={100}
          />
          <RHF.FormDatePicker control={control} name="invSendDate" label="청구서 발송일" />
        </FlexBox>

        <Separator className="my-2 border-t" />

        <FlexBox>
          <RHF.Input
            control={control}
            name="invMgr.userName"
            label="비용담당"
            actions={
              <>
                <Button
                  className="w-5"
                  onClick={() => onClickUserModal("invMgr.userSeq", "invMgr.userName")}
                >
                  <Icons.Search className="size-3" />
                </Button>
              </>
            }
            inputDisabled placeholder=""
            className="w-34"
          />
          <RHF.Input control={control} name="invMgr.userSeq" type={"hidden"} />

          <RHF.Input
            control={control}
            name="ourRef"
            label="OurRef"
            ess
            actions={
              <>
                <CustomTooltip message="OurRef번호를 선택하세요">
                  <Button className="w-5" onClick={() => onClickOurRefModal("ourRef", "ourRef")}>
                    <Icons.Search className="size-3" />
                  </Button>
                </CustomTooltip>
              </>
            }
            inputDisabled placeholder=""
          />
          <RHF.Input control={control} name="clientRef" label="출원인 관리번호" disabled placeholder="" />
          <RHF.Input control={control} name="deptName" label="부서" className="w-30" disabled placeholder="" />
          <RHF.Input
            control={control}
            name="adminMgr.userName"
            label="관리 담당자"
            className="w-30"
            disabled placeholder=""
          />

          <RHF.Input control={control} name="adminMgr.userSeq" type={"hidden"} />
          <RHF.Input
            control={control}
            name="caseMgr.userName"
            label="사건 담당자"
            className="w-30"
            disabled placeholder=""
          />

          <RHF.Input
            control={control}
            name="attorney.userName"
            label="담당변리사"
            actions={
              <>
                <Button
                  className="w-5"
                  onClick={() => onClickUserModal("attorney.userSeq", "attorney.userName")}
                >
                  <Icons.Search className="size-3" />
                </Button>
              </>
            }
            className="w-34"
            inputDisabled placeholder=""
          />
          <RHF.Input control={control} name="attorney.userSeq" type={"hidden"} />
        </FlexBox>

        <Separator className="my-2 border-t" />

        <UnitInnerBox className="bg-bg-50 rounded-[4px]">
          <FlexBox className="justify-between">
            <RHF.FormField gap={2} className="pr-12">
              <RHF.Input control={control} name="rightType.codeName" label="권리" disabled placeholder="" />
              <RHF.Input control={control} name="appDate" label="출원일" disabled placeholder="" dateOnly />
              <RHF.Input control={control} name="appNo" label="출원번호" disabled placeholder="" krAppNoOnly />
              <RHF.Input control={control} name="regDate" label="등록일" disabled placeholder="" dateOnly />
              <RHF.Input control={control} name="regNo" label="등록번호" disabled placeholder="" krRegNoOnly />
            </RHF.FormField>

            <RHF.FormField gap={2}>
              <RHF.Input
                control={control}
                name="grade"
                label="등급"
                className="w-14"
                align="center"
                disabled placeholder=""
              />
              <RHF.Input
                control={control}
                name="finalClaimsCount"
                label="독립항"
                className="w-14"
                align="center"
                disabled placeholder=""
              />
              <RHF.Input
                control={control}
                name="dependentClaims"
                label="종속항"
                className="w-14"
                align="center"
                disabled placeholder=""
              />
              <RHF.Input
                control={control}
                name="specPage"
                label="명세서"
                className="w-14"
                align="center"
                disabled placeholder=""
              />
              <RHF.Input
                control={control}
                name="drawingCount"
                label="도면수"
                className="w-14"
                align="center"
                disabled placeholder=""
              />
              <RHF.Input
                control={control}
                name="figureCount"
                label="도수"
                className="w-14"
                align="center"
                disabled placeholder=""
              />
            </RHF.FormField>
          </FlexBox>
        </UnitInnerBox>

        <FormUnitBox
          title="당사자 정보"
          className="rounded-[4px] inset-shadow-none [&>div]:min-h-7 [&>div>h2]:text-xs [&>div>h2]:tracking-tighter"
          vertical
        >
          <FlexBox>
            <RHF.FormSelect
              control={control}
              name="customerSeq"
              label="고객명"
              ess
              items={codeList.customerCodeList || []}
              placeholder="고객사를 선택하세요"
            />

            <RHF.FormSelect
              // 상세조회 시 값이 깨지지 않도록 key를 제거하거나 고정값으로 변경
              // 만약 비활성화 이슈가 다시 생기면 `key={!!currentCustomerSeq + ""}` 정도로 타협
              control={control}
              name="customerContact.userSeq"
              label="고객 담당자"
              items={managerOptions}
              placeholder={isLoading || isFetching ? "조회 중..." : "담당자를 선택하세요"}
              disabled={!currentCustomerSeq}
            />
          </FlexBox>
          <FlexBox>
            <RHF.Input control={control} name="applicantName" label="출원인" disabled placeholder="" />
            <RHF.Input
              control={control}
              name="clientName"
              label="의뢰인"
              inputDisabled
              actions={
                <Button className="w-5" onClick={() => onClickCstModal("client", "clientName")}>
                  <Icons.Search className="size-3" />
                </Button>
              }
            />
          </FlexBox>
        </FormUnitBox>

        <FormUnitBox
          title="명칭 정보"
          className="rounded-[4px] inset-shadow-none [&>div]:min-h-7 [&>div>h2]:text-xs [&>div>h2]:tracking-tighter"
          vertical
        >
          <FlexBox>
            <RHF.FormTextarea control={control} name="titleKo" label="국문" disabled placeholder="" />
            <RHF.FormTextarea control={control} name="titleEn" label="영문" disabled placeholder="" />
          </FlexBox>
        </FormUnitBox>

        <FlexBox>
          <FormUnitBox
            title="류(Class)"
            className="rounded-[4px] inset-shadow-none [&>div]:min-h-7 [&>div>h2]:text-xs [&>div>h2]:tracking-tighter"
            vertical
          >
            <RHF.Input control={control} name="productClass" disabled placeholder="" />
          </FormUnitBox>

          <FormUnitBox
            title="OA 대상서류"
            className="[&>div>h2]:text-p-color-5 [&>div]:first-of-type:bg-p-color-5/5 rounded-[4px] inset-shadow-none [&>div]:min-h-7 [&>div>h2]:text-xs [&>div>h2]:tracking-tighter"
            vertical
          >
            <RHF.Input control={control} name="oaDocument" maxLength={50} />
          </FormUnitBox>
        </FlexBox>

        <FlexBox>
          <FormUnitBox
            title="청구내용"
            className="rounded-[4px] inset-shadow-none [&>div]:min-h-7 [&>div>h2]:text-xs [&>div>h2]:tracking-tighter"
            vertical
          >
            <RHF.FormTextarea control={control} name="invContent" />
          </FormUnitBox>

          <FormUnitBox
            title="비고"
            className="rounded-[4px] inset-shadow-none [&>div]:min-h-7 [&>div>h2]:text-xs [&>div>h2]:tracking-tighter"
            vertical
          >
            <RHF.FormTextarea control={control} name="note" />
          </FormUnitBox>
        </FlexBox>
      </FormUnitBox>

      <UserModal
        open={isUserOpenModal}
        onOpenChange={onOpenChange}
        title="담당자 선택"
        input={inputKeyInfo}
        onSuccess={onSuccess}
      />

      <OurRefModal
        open={isOurRefOpenModal}
        onOpenChange={onOurRefOpenChange}
        title="OurRef 선택"
        input={ourRefInputKeyInfo}
        onSuccess={onOurRefSuccess}
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

export default DefaultInfo;
