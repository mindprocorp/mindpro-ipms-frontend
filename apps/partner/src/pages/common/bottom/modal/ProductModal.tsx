import { CustomScrollArea, FlexBox, FormDialog, RHF, Separator } from "@repo/ui";
import React, { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import { useProductListModalForm } from "@shared/schema/common/modal/modalform.ts";
import { useMutation } from "@tanstack/react-query";
import { bottomQueries } from "@shared/query/common/bottomQueries.ts";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import {
  type ProductModalFormInput,
  type ProductModalFormOutput,
  productModalSchema,
} from "@shared/schema/common/modal/productModalSchema.ts";
import { z } from "zod";

type SuccessData = {
  callbackData: any;
};

type ProgressModalProps = {
  propData?: any;
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (rtnData: SuccessData) => void;
  rowData?: any;
};

export const ProductModal = ({
  title,
  open,
  onOpenChange,
  onSuccess,
  propData,
  rowData,
}: ProgressModalProps) => {
  const form = useProductListModalForm();
  const createProductMutation = useMutation(bottomQueries.createProduct());
  const { openAlert } = useAlertStore();
  const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
    const isEdit = !!rowData?.productGroupId;
    setIsEditMode(isEdit);

    if (open) {
      if (isEdit) {
        form.reset(rowData);
      } else {
        form.reset();
        form.setValue("appSeq", propData);
      }
    }
  }, [open, propData, rowData, form]);

  const onSubmit = (values: ProductModalFormInput) => {
    try {
      const vaildData: ProductModalFormOutput = productModalSchema.parse(values);
      const modeText = isEditMode ? "수정" : "저장";

      openAlert({
        className: "w-[400px]",
        message: `${modeText}하시겠습니까?`,
        confirmText: "확인",
        cancelText: "취소",
        onConfirm: () => {
          const payload = {
            productGroupId: isEditMode ? rowData.productGroupId : null,
            prodList: [
              {
                appSeq: vaildData.appSeq,
                productClass: vaildData.productClass,
                productCount: vaildData.productCount,
                productNameKo: vaildData.productSummaryKo,
                productNameEn: vaildData.productSummaryEn,
                note: ""
              }
            ]
          };

          createProductMutation.mutate(payload as any, {
            onSuccess: (response) => {
              console.log("[성공]", response);
              onOpenChange(false);
              onSuccess?.({
                callbackData: "PRODUCT",
              });
              setTimeout(() => {
                openAlert({
                  className: "w-[400px]",
                  message: `${modeText}완료하였습니다`,
                  confirmText: "확인",
                });
              }, 300);
            },
          });
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.issues?.[0];
        openAlert({
          title: "입력 확인",
          message: firstError 
            ? `${firstError.path.join(".")} : ${firstError.message}`
            : "입력값 검증에 실패했습니다.",
          confirmText: "확인",
        });
      } else {
        console.error(error);
      }
    }
  };

  const onError = (errors: any) => {
    console.log(" Zod errors:", errors);
  };

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title ?? (isEditMode ? "지정상품 수정" : "지정상품 등록")}
        onSubmit={form.handleSubmit(onSubmit, onError)}
        submitText={isEditMode ? "수정" : "저장"}
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-300!"
      >
        <CustomScrollArea className="h-140">
          <FlexBox vertical className="gap-4 pt-3">
            <div className="w-full">
              <FlexBox>
                <RHF.Input
                  control={form.control}
                  name="productClass"
                  label="Class"
                  className="w-30"
                  numericOnly
                />
                <RHF.Input
                  control={form.control}
                  name="productCount"
                  label="상품수"
                  className="w-30"
                  numericOnly
                />
              </FlexBox>
            </div>

            <Separator className="border-t" />

            <div className="w-full">
              <h2 className="pb-1 text-sm font-semibold">지정상품(국문)</h2>
              <FlexBox>
                <RHF.FormTextarea control={form.control} name="productSummaryKo" />
              </FlexBox>
            </div>
            <div className="w-full">
              <h2 className="pb-1 text-sm font-semibold">지정상품(영문)</h2>
              <FlexBox>
                <RHF.FormTextarea control={form.control} name="productSummaryEn" />
              </FlexBox>
            </div>
          </FlexBox>
        </CustomScrollArea>
      </FormDialog>
    </FormProvider>
  );
};
