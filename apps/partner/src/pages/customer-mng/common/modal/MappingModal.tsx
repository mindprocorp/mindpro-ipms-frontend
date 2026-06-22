import { FlexBox, FormDialog, RHF, Icons, Button, Separator } from "@repo/ui";
import type { ModalProps } from "@repo/schema";
import React, { useState, useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MappingSchema, type MappingFormInput } from "@shared/schema/customer/customerModalsSchema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { customerQueries } from "@shared/query/customer/queries";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import type { CodeSelectOption } from "@shared/api/common/commApi.ts";

interface MappingModalProps extends ModalProps {
}

export const MappingModal = ({
  title = "관련고객 등록",
  open,
  onOpenChange,
  onSuccess,
  propData,
  editData,
}: MappingModalProps) => {
  const { openAlert } = useAlertStore();
  const [selectedCustomerSeq, setSelectedCustomerSeq] = useState(editData?.customerSeq || "");
  const [customerCodeList, setCustomerCodeList] = useState<CodeSelectOption[]>([]);

  //   0. 모달 오픈 시 고객 전체 리스트 조회
  const searchCustomerMutation = useMutation(customerQueries.searchList());
  useEffect(() => {
    if (open) {
      searchCustomerMutation.mutate({ page: 1, pageSize: 1000 } as any, {
        onSuccess: (response) => {
          console.log("Customer search response:", response);
          const customerList = response.data?.list || response.data || [];
          console.log("Customer list:", customerList);
          const codes = customerList.map((item: any) => ({
            label: item.clientNameKo || item.customerNameKo,
            value: item.customerSeq,
          }));
          setCustomerCodeList(codes);
        },
      });
    }
  }, [open]);

  const form = useForm<MappingFormInput>({
    resolver: zodResolver(MappingSchema),
    defaultValues: {
      relatedCustomerName: "",
      clientNameEn: "",
      kipoClientNo: "",
      appAddress: "",
      contactAddress: "",
      relationCode: "CURTMR",
      note: "",
    },
  });

  const { setValue, control, handleSubmit, reset, watch } = form;

  // editData가 변경될 때 폼 값 설정
  useEffect(() => {
    console.log("MappingModal useEffect - editData:", editData);

    if (editData && Object.keys(editData).length > 0) {
      setValue("relatedCustomerName", editData.customerSeq || editData.relatedCustomerSeq || editData.tblSeq || "", { shouldValidate: false });
      setValue("clientNameEn", editData.clientNameEn || "", { shouldValidate: false });
      setValue("kipoClientNo", editData.kipoClientNo || "", { shouldValidate: false });
      setValue("appAddress", editData.appAddress || "", { shouldValidate: false });
      setValue("contactAddress", editData.contactAddress || "", { shouldValidate: false });
      setValue("relationCode", editData.relationCode || "CURTMR", { shouldValidate: false });
      setValue("note", editData.note || "", { shouldValidate: false });
    }
  }, [editData, setValue]);

  const watchedCustomerName = useWatch({
    control,
    name: "relatedCustomerName",
  });

  //   2. 선택된 고객사 명칭으로 Seq 찾기 및 상세 정보 세팅
  useEffect(() => {
    if (watchedCustomerName && customerCodeList.length > 0) {
      const selected = customerCodeList.find(c => c.value === watchedCustomerName);
      if (selected) {
        // ID 저장 (FormSelect는 value로 customerSeq를 반환합니다)
        setSelectedCustomerSeq(selected.value);
      }
    }
  }, [watchedCustomerName, customerCodeList, setValue]);

  //   3. [옵션] 선택된 Seq로 고객 상세 정보를 가져와서 폼에 박기
  // (리스트에 이름/ID만 있을 경우 상세 주소 등을 가져오기 위함)
  const { data: customerDetail } = useQuery({
    queryKey: ["mappingCustomerDetail", selectedCustomerSeq],
    queryFn: async () => {
      const options = customerQueries.detail(); // 기존 고객상세 쿼리 활용
      if (options.mutationFn) return options.mutationFn(selectedCustomerSeq, {} as any);
      return null;
    },
    enabled: !!selectedCustomerSeq,
  });

  // 상세 정보가 로드되면 폼에 자동 매핑
  useEffect(() => {
    if (customerDetail?.data) {
      const d = customerDetail.data;
      setValue("clientNameEn", d.clientNameEn || (d as any).customerNameEn || "", { shouldValidate: true });
      setValue("kipoClientNo", d.kipoClientNo || "", { shouldValidate: true });
      setValue("appAddress", (d as any).appAddress || "", { shouldValidate: true });
      setValue("contactAddress", (d as any).contactAddress || "", { shouldValidate: true });
    }
  }, [customerDetail, setValue]);

  const saveMutation = useMutation(customerQueries.mappingSave());

  const onSubmit = (values: MappingFormInput) => {
    if (!selectedCustomerSeq && !editData?.customerMappSeq) {
      openAlert({ message: "고객사를 선택해주세요.", confirmText: "확인" });
      return;
    }

    const payload: any = {
      tblSeq: propData, // 부모 시퀀스 (CUSTMR...)
      customerSeq: selectedCustomerSeq || editData?.customerSeq, // 선택된 관련고객 시퀀스
      kipoClientNo: values.kipoClientNo || "",
      relationCode: values.relationCode,
      note: values.note,
    };

    // 수정 시에만 PK 포함
    if (editData?.customerMappSeq) {
      payload.customerMappSeq = editData.customerMappSeq;
    }

    const modeText = editData?.customerMappSeq ? "수정" : "저장";
    openAlert({
      className: "w-[400px]",
      message: `${modeText}하시겠습니까?`,
      confirmText: "확인",
      cancelText: "취소",
      onConfirm: () => {
        saveMutation.mutate(payload, {
          onSuccess: () => {
            onSuccess?.({ callbackData: "MAPPING" } as any);
            reset();
            onOpenChange(false);
            setTimeout(() => {
              openAlert({ className: "w-[400px]", message: `${modeText}완료하였습니다`, confirmText: "확인" });
            }, 300);
          },
          onError: () => {
            openAlert({ message: "저장에 실패했습니다.", confirmText: "확인" });
          },
        });
      },
    });
  };

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={handleSubmit(onSubmit)}
        submitText="저장"
        open={open}
        onOpenChange={onOpenChange}
      >
        <FlexBox vertical className="gap-3">
          {/*   4. 고객명 선택 리스트 (DefaultInfo와 동일한 방식) */}
          <RHF.FormSelect
            control={control}
            name="relatedCustomerName"
            label="고객명(한글)"
            items={customerCodeList}
            placeholder="고객사를 선택하세요"
          />

          {/*   자동 입력되는 항목들 (상세조회 결과가 박힘) */}
          <RHF.Input control={control} name="clientNameEn" label="고객명(영문)" disabled />
          <RHF.Input control={control} name="kipoClientNo" label="출원인 코드" disabled />

          <RHF.FormTextarea control={control} name="appAddress" label="출원주소" disabled />
          <RHF.FormTextarea control={control} name="contactAddress" label="연락주소" disabled />

          <Separator className="my-2" />

          <RHF.Input control={control} name="relationCode" label="관계유형" />
          <RHF.FormTextarea control={control} name="note" label="비고" />
        </FlexBox>
      </FormDialog>
    </FormProvider>
  );
};
