import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  RHF,
} from "@repo/ui";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dispatchSchema, type DispatchSchemaType } from "@shared/schema/dispatch/dispatchSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dispatchQueries } from "@shared/query/dispatch/queries";
import { useAlertStore } from "@shared/store/useAlertStore";
import { useEffect } from "react";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: DispatchSchemaType | null;
  onSuccess?: () => void;
};

const DocumentDispatchModal = ({ open, onOpenChange, data, onSuccess }: Props) => {
  const queryClient = useQueryClient();
  const { openAlert } = useAlertStore();

  const form = useForm<DispatchSchemaType>({
    resolver: zodResolver(dispatchSchema),
    defaultValues: {
      category: "송신",
      docType: "",
      client: "",
      manager: "",
      docContent: "",
      method: "",
      regNo: "",
      ackYn: "N",
      postAddr: "",
      note: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (data) {
        form.reset(data);
      } else {
        form.reset({
          category: "송신",
          docType: "",
          dispatchDate: new Date().toISOString().split("T")[0],
          client: "",
          manager: "",
          docContent: "",
          method: "",
          sendDate: "",
          regNo: "",
          ackYn: "N",
          postAddr: "",
          note: "",
        });
      }
    }
  }, [data, form, open]);

  const { mutate, isPending } = useMutation({
    ...dispatchQueries.save(),
    onSuccess: () => {
      openAlert({
        message: data ? "수정되었습니다." : "저장되었습니다.",
        confirmText: "확인",
        showCancel: false,
      });
      queryClient.invalidateQueries({ queryKey: ["dispatchList"] });
      onSuccess?.();
      onOpenChange(false);
    },
    onError: (error: any) => {
      console.error("저장 실패:", error);
      openAlert({
        message: "저장에 실패하였습니다.",
        confirmText: "확인",
        showCancel: false,
      });
    },
  });

  const onSubmit = (values: DispatchSchemaType) => {
    mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl overflow-hidden p-0">
        <DialogHeader className="p-5 pb-0">
          <DialogTitle className="text-lg font-bold text-slate-800">
            문서 수발 {data ? "상세 정보 수정" : "신규 내역 등록"}
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-5 pt-2 space-y-4">
            {/* 상단 상세 내역 (2줄로 압축 및 라디오 헤더 이동) */}
            <div className="space-y-3">
              <FormUnitBox
                title="기본정보"
                className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5 [&>div>div>*]:flex-1"
                actions={
                  <div className="flex items-center bg-white/50 px-2 py-0.5 rounded border border-p-color-1/10">
                    <RHF.FormRadio
                      control={form.control}
                      name="category"
                      label=""
                      items={[
                        { label: "송신", value: "송신" },
                        { label: "수신", value: "수신" },
                      ]}
                      className="[&>div]:gap-4 [&>div>div>span]:text-[12px]"
                    />
                  </div>
                }
              >
                <RHF.Input control={form.control} name="docType" label="종류" />
                <RHF.FormDatePicker control={form.control} name="dispatchDate" label="일자" />
                <RHF.Input control={form.control} name="client" label="거래처" />
                <RHF.Input control={form.control} name="manager" label="담당자" />
              </FormUnitBox>

              <FormUnitBox
                title="발송정보"
                className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5 [&>div>div>*]:flex-1"
                actions={
                  <div className="flex items-center bg-white/50 px-2 py-0.5 rounded border border-p-color-1/10">
                    <RHF.FormRadio
                      control={form.control}
                      name="ackYn"
                      label="수신확인"
                      items={[
                        { label: "Y", value: "Y" },
                        { label: "N", value: "N" },
                      ]}
                      className="[&>div]:gap-4 [&>div>div>span]:text-[12px] [&>h2]:text-[12px] [&>h2]:min-w-[50px]"
                    />
                  </div>
                }
              >
                <RHF.Input control={form.control} name="method" label="전달방법" />
                <RHF.FormDatePicker control={form.control} name="sendDate" label="발송일" />
                <RHF.Input control={form.control} name="regNo" label="등기번호" />
                <RHF.Input control={form.control} name="postAddr" label="우편주소" />
              </FormUnitBox>
            </div>

            {/* 하단 텍스트 영역 */}
            <div className="space-y-4">
              <FormUnitBox
                title="상세 문서내용"
                className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5"
                fullsize
                boxfull
              >
                <RHF.FormTextarea 
                  control={form.control} 
                  name="docContent" 
                  placeholder="상세 내용을 입력해 주세요" 
                  rows={6} 
                />
              </FormUnitBox>

              <FormUnitBox
                title="비고"
                className="[&>div>h2]:text-p-color-1 [&>div]:first-of-type:bg-p-color-1/5"
                fullsize
                boxfull
              >
                <RHF.FormTextarea 
                  control={form.control} 
                  name="note" 
                  placeholder="기타 특이사항을 입력해 주세요" 
                  rows={4} 
                />
              </FormUnitBox>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline-gray" onClick={() => onOpenChange(false)} className="px-6 h-9">
                취소
              </Button>
              <Button 
                type="submit" 
                disabled={isPending} 
                className="bg-p-color-1 hover:bg-p-color-1/90 text-white px-10 h-9 font-bold"
              >
                {isPending ? "처리중..." : "저장하기"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentDispatchModal;
