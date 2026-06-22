import { Button, CustomTooltip, FlexBox, Icons, RHF, Separator } from "@repo/ui";
import { FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext, useWatch } from "react-hook-form";
import React, { useEffect, useRef } from "react";
// 해외 아웃고잉 스키마 타입 임포트
import { type BillOutgoingFormInput } from "@shared/schema/bill/billOverseaOutgoingSchema.ts";
import type { CodeSelectOption } from "@shared/api/common/commApi.ts";
import {
  type InputKeyInfoType,
  type SuccessData,
  UserModal,
} from "@pages/common/modal/user/UserModal.tsx";
import { OurRefModal, type SuccessOurRefData } from "@pages/common/modal/ourref/OurRefModal.tsx";
import { useQuery } from "@tanstack/react-query";
import { customerQueries } from "@shared/query/customer/queries";
import { CustomerSelectModal, type CustomerCategory, type CustomerSelected } from "@pages/common/modal/customer/CustomerSelectModal.tsx";

interface CodeListType {
  invCategoryCodeList: CodeSelectOption[];
  billEventCodeList: CodeSelectOption[];
  invTypeCodeList: CodeSelectOption[];
  customerCodeList: CodeSelectOption[];
}

const DefaultInfo = (codeList: CodeListType) => {
  const { control, setValue, reset, watch, getValues, formState: { isDirty } } = useFormContext<BillOutgoingFormInput>();

  // 1. 고객사 Seq 실시간 감시
  const currentCustomerSeq = useWatch({
    control,
    name: "customerSeq" as any,
  });

  // 이전 Seq를 기억하기 위한 Ref (상세조회 시 자동 초기화 방지용)
  const prevCustomerSeqRef = useRef<string>(currentCustomerSeq);

  const selectedUserInfoSeq = useWatch({
    control,
    name: "customerContact.userSeq" as any,
  });

  const selectedName = watch("customerName" as any);

  // 모달 상태 관리
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

  // 3. 담당자 선택 시 이름을 userName 필드에 자동 매핑
  useEffect(() => {
    if (selectedUserInfoSeq && managerOptions.length > 0) {
      const selectedManager = managerOptions.find((m: any) => m.value === selectedUserInfoSeq);
      if (selectedManager) {
        setValue("customerContact.userName" as any, selectedManager.label, { shouldValidate: true });
      }
    }
  }, [selectedUserInfoSeq, managerOptions, setValue]);

  // 4. [수정 핵심] 고객사가 '사용자에 의해' 변경될 때만 담당자 정보 초기화
  useEffect(() => {
    // 1) 폼이 이미 로드된 상태(isDirty)이고 2) 이전 값과 현재 값이 다를 때만 초기화 실행
    if (currentCustomerSeq && prevCustomerSeqRef.current !== currentCustomerSeq && isDirty) {
      setValue("customerContact.userSeq" as any, "");
      setValue("customerContact.userName" as any, "");
    }
    // 현재 Seq를 Ref에 저장하여 다음 비교에 사용
    prevCustomerSeqRef.current = currentCustomerSeq;
  }, [currentCustomerSeq, setValue, isDirty]);

  // 5. 고객사 명칭으로 Seq 자동 찾기 (최초 렌더링 시 및 명칭 변경 시)
  useEffect(() => {
    if (selectedName && codeList.customerCodeList) {
      const selected = codeList.customerCodeList.find(c => c.label === selectedName);
      if (selected) {
        setValue("customerSeq" as any, selected.value, { shouldValidate: true });
      }
    }
  }, [selectedName, codeList.customerCodeList, setValue]);

  useEffect(() => {
    setValue("caseCategory.codeName" as any, "해외청구서");
    setValue("caseCategory.code" as any, "70");
  }, [setValue]);

  // --- 핸들러 함수들 ---
  const onSuccess = (rtnData: SuccessData) => {
    setValue(rtnData.input.inputKey as any, rtnData.userInfo[0].id, { shouldValidate: true });
    setValue(rtnData.input.inputName as any, rtnData.userInfo[0].name, { shouldValidate: true });
  };
  const onOurRefSuccess = (rtnData: SuccessOurRefData) => {
    const data = rtnData.ourRefInfo[0] as any;
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
        // [수정] 만약 스키마에는 문자열인데 넘어온 값이 객체라면 userName 또는 customerName 사용
        if (['applicantName', 'clientName', 'foreignAgentName'].includes(key)) {
            const nameValue = (value && typeof value === 'object') ? (value.userName || value.customerName || "") : value;
            setValue(key as any, nameValue ?? "", { shouldValidate: true, shouldDirty: true });
        } else {
            setValue(key as any, value ?? "", { shouldValidate: true, shouldDirty: true });
        }
      }
    });
  };

  const onClickCstModal = (category: CustomerCategory, inputKey: string) =>
    setCstModal({ open: true, category, inputKey });

  const onCstSelect = (item: CustomerSelected) => {
    setValue(cstModal.inputKey as any, item.customerName, { shouldValidate: true, shouldDirty: true });
  };


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
          <RHF.FormSelect control={control} name="invClass.code" items={codeList.billEventCodeList} label="청구분류" ess />
          <RHF.FormSelect control={control} name="invType.code" items={codeList.invTypeCodeList} label="청구종류" ess />
          <RHF.FormDatePicker control={control} name="invDate" label="청구일" ess />
          <RHF.Input
            control={control}
            name="invNo"
            label="청구번호"
            ess
            maxLength={100}
            // actions={<Button className="w-5"><Icons.Search className="size-3" /></Button>}
          />
          <RHF.FormDatePicker control={control} name="invSendDate" label="청구서 발송일" />
        </FlexBox>

        <Separator className="my-2 border-t" />

        <FlexBox>
          <RHF.Input
            control={control}
            name="invMgr.userName"
            label="비용담당"
            actions={<Button className="w-5" onClick={() => { setIsUserOpenModal(true); setInputKeyInfo({ inputKey: "invMgr.userSeq", inputName: "invMgr.userName" }); }}><Icons.Search className="size-3" /></Button>}
            inputDisabled
            className="w-34"
          />
          <RHF.FormDatePicker control={control} name="agentInvDate" label="대리인청구일" />
          <RHF.FormDatePicker control={control} name="debitReceiptDate" label="DEBIT접수일" />
          <RHF.Input
            control={control}
            name="debitNo"
            label="DEBIT번호"
          />
          <RHF.Input control={control} name="invMgr.userSeq" type="hidden" />

          <RHF.Input
            control={control}
            name="ourRef"
            label="OurRef"
            ess
            actions={
              <CustomTooltip message="OurRef번호를 선택하세요">
                <Button className="w-5" onClick={() => { setIsOurRefOpenModal(true); setOurRefInputKeyInfo({ inputKey: "ourRef", inputName: "ourRef" }); }}><Icons.Search className="size-3" /></Button>
              </CustomTooltip>
            }
          />
          <RHF.Input control={control} name="yourRef" label="YourRef" disabled placeholder="" />
        </FlexBox>
        <FlexBox>
          <RHF.Input control={control} name="clientRef" label="출원인 관리번호" disabled placeholder="" />
          <RHF.Input control={control} name="deptName" label="부서" className="w-30" disabled placeholder="" />
          <RHF.Input control={control} name="adminMgr.userName" label="관리 담당자" className="w-30" disabled placeholder="" />
          <RHF.Input control={control} name="adminMgr.userSeq" type="hidden" />
          <RHF.Input control={control} name="caseMgr.userName" label="사건 담당자" className="w-30" disabled placeholder="" />

          <RHF.Input
            control={control}
            name="attorney.userName"
            label="담당변리사"
            actions={<Button className="w-5" onClick={() => { setIsUserOpenModal(true); setInputKeyInfo({ inputKey: "attorney.userSeq", inputName: "attorney.userName" }); }}><Icons.Search className="size-3" /></Button>}
            className="w-34"
            inputDisabled
          />
          <RHF.Input control={control} name="attorney.userSeq" type="hidden" />

        </FlexBox>

        <Separator className="my-2 border-t" />

        <UnitInnerBox className="bg-bg-50 rounded-[4px]">
          <FlexBox className="justify-between">
            <RHF.FormField gap={2} className="pr-12">
              <RHF.Input control={control} name="rightType.codeName" label="권리" disabled placeholder="" />
              <RHF.Input control={control} name="appDate" label="출원일" disabled placeholder="" dateOnly />
              <RHF.Input control={control} name="appNo" label="출원번호" disabled placeholder="" />
              <RHF.Input control={control} name="regDate" label="등록일" disabled placeholder="" dateOnly />
              <RHF.Input control={control} name="regNo" label="등록번호" disabled placeholder="" />
              <RHF.Input control={control} name="countryCode.code" label="국가코드" disabled placeholder="" />
              <RHF.Input control={control} name="countryCode.codeName" label="국가명" disabled placeholder="" />
            </RHF.FormField>

            <RHF.FormField gap={2}>
              <RHF.Input control={control} name="grade" label="등급" className="w-14" disabled placeholder="" />
              <RHF.Input control={control} name="independentClaims" label="독립항" className="w-14" disabled placeholder="" />
              <RHF.Input control={control} name="dependentClaims" label="종속항" className="w-14" disabled placeholder="" />
              <RHF.Input control={control} name="figureCount" label="국내명세서" className="w-14" disabled placeholder="" />
              <RHF.Input control={control} name="specCount" label="해외명세서" className="w-14" disabled placeholder="" />
              <RHF.Input control={control} name="drawingCount" label="도면수" className="w-14" disabled placeholder="" />

            </RHF.FormField>
          </FlexBox>
        </UnitInnerBox>

        <FormUnitBox title="당사자 정보" className="rounded-[4px] inset-shadow-none" vertical>
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
              name="foreignAgentName"
              label="해외대리인"
              inputDisabled
              actions={
                <Button className="w-5" onClick={() => onClickCstModal("foreignAgent", "foreignAgentName")}>
                  <Icons.Search className="size-3" />
                </Button>
              }
            />
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

        {/* 하단 나머지 필드 */}
        <FormUnitBox title="명칭 정보" className="rounded-[4px] inset-shadow-none" vertical>
          <FlexBox>
            <RHF.FormTextarea control={control} name="titleKo" label="국문" disabled placeholder="" />
            <RHF.FormTextarea control={control} name="titleEn" label="영문" disabled placeholder="" />
          </FlexBox>
        </FormUnitBox>
        <FlexBox>
          <FormUnitBox title="류(Class)" vertical><RHF.Input control={control} name="productClass" disabled placeholder="" /></FormUnitBox>
          <FormUnitBox title="OA 대상서류" vertical><RHF.Input control={control} name="oaDocument" maxLength={50} /></FormUnitBox>
        </FlexBox>

        <FlexBox>
          <FormUnitBox title="청구내용" vertical><RHF.FormTextarea control={control} name="invContent" /></FormUnitBox>
          <FormUnitBox title="비고" vertical><RHF.FormTextarea control={control} name="note" /></FormUnitBox>
        </FlexBox>
      </FormUnitBox>

      <UserModal open={isUserOpenModal} onOpenChange={(o) => setIsUserOpenModal(o)} title="담당자 선택" input={inputKeyInfo} onSuccess={onSuccess} />
      <OurRefModal open={isOurRefOpenModal} onOpenChange={(o) => setIsOurRefOpenModal(o)} title="OurRef 선택" input={ourRefInputKeyInfo} onSuccess={onOurRefSuccess} />
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
