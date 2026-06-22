import { FlexBox, FormDialog, RHF, Separator } from "@repo/ui";
import React, { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import { useMemoModalForm } from "@shared/schema/common/modal/modalform.ts";
import { useMutation } from "@tanstack/react-query";
import { bottomQueries } from "@shared/query/common/bottomQueries.ts";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import {
  type MemoModalFormInput,
  type MemoModalFormOutput,
  memoModalSchema,
} from "@shared/schema/common/modal/memoModalSchema.ts";
import type {
  FileItem,
  ServerFileItem,
} from "../../../../../../../packages/ui/src/components/ui/grouping";
import { downloadFile } from "@shared/util/fileUtil";
import { z } from "zod";

type SuccessData = {
  callbackData: any;
};

type MemoModalProps = {
  propData?: any;
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (rtnData: SuccessData) => void;
  rowData?: any;
};

export const MemoModal = ({ title, open, onOpenChange, onSuccess, propData, rowData }: MemoModalProps) => {
  const form = useMemoModalForm();
  const createMemoMutation = useMutation(bottomQueries.createMemo());
  const { openAlert } = useAlertStore();
  const [paperFiles, setPaperFiles] = useState<ServerFileItem[]>([]);

  const isEditMode = !!rowData?.memoSeq;

  // 수정 모드에서 삭제된 서버 파일 seq 목록
  const [deletedFileSeqs, setDeletedFileSeqs] = useState<string[]>([]);

  // TODO: API 완성 후 상세조회 함수 연결
  const getMemoDetailMutation = useMutation(bottomQueries.getMemoDetail());
  const getMemoDetail = (memoSeq: string) => {
    getMemoDetailMutation.mutate(memoSeq, {
      onSuccess: (response) => {
        form.reset(response.data);

        //@ts-ignore
        setPaperFiles(response.data.fileInfo);
      },
    });
  };

  useEffect(() => {
    if (open) {
      if (isEditMode) {
        // 수정모드 - 클릭된 row 데이터로 폼 세팅
        getMemoDetail(rowData.memoSeq);
      } else {
        // 신규모드
        form.reset();
        form.setValue("files", []);
        form.setValue("fileInfo", []);
        form.setValue("tblSeq", propData);
        setPaperFiles([]);
      }
      setDeletedFileSeqs([]);
    }
  }, [open, rowData, propData, form]);

  const onSubmit = (values: MemoModalFormOutput) => {
    try {
      const vaildData: MemoModalFormOutput = memoModalSchema.parse(values);
      const modeText = isEditMode ? "수정" : "저장";

      openAlert({
        className: "w-[400px]",
        message: `${modeText}하시겠습니까?`,
        confirmText: "확인",
        cancelText: "취소",
        onConfirm: () => {
          const payload = isEditMode
            ? { ...vaildData, memoSeq: rowData.memoSeq, deletedFileSeqList: deletedFileSeqs }
            : vaildData;

          //@ts-ignore
          createMemoMutation.mutate(payload, {
            onSuccess: () => {
              onOpenChange(false);
              onSuccess?.({ callbackData: "MEMO" });
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
      console.error("Validation failed:", error);
      // 알럿을 띄우지 않음으로써 RHF의 인라인 에러(빨간 글씨)가 사용자에게 노출되도록 함
    }
  };

  const handleFilesChange = (files: FileItem[]) => {
    const fileList: File[] = [];
    for (const file of files) {
      fileList.push(file.FileObj);
    }
    form.setValue("files", fileList);
  };

  const handleServerFileRemove = (fileSeq: string) => {
    setDeletedFileSeqs((prev) => [...prev, fileSeq]);
  };

  const onError = (errors: any) => {
    console.log(" Zod errors:", errors);
  };

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title ?? (isEditMode ? "메모 수정" : "메모 등록")}
        onSubmit={form.handleSubmit(onSubmit, onError)}
        submitText={isEditMode ? "수정" : "저장"}
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-100!" // 입금 모달과 동일한 사이즈로 통일
      >
        <FlexBox vertical className="gap-4">
          {/* 첫 번째 행: 작성일, 제목 */}
          <FlexBox className="items-end gap-2">
            <RHF.FormDatePicker control={form.control} name="memoRegDate" label="작성일" />
            <RHF.Input control={form.control} name="memoTitle" label="제목" />
          </FlexBox>

          {/* 두 번째 행: 필독 여부 (간단한 옵션은 단독 혹은 제목 옆에 배치 가능) */}
          <FlexBox className="items-center px-1">
            <RHF.FormCheckbox
              control={form.control}
              outputFormat={["Y", "N"]}
              name="mustReadYn"
              label="중요 메모(필독)"
            />
          </FlexBox>

          <Separator className="border-t" />

          {/* 세 번째 행: 메모 본문 */}
          <div className="w-full">
            <RHF.FormTextarea
              control={form.control}
              name="note"
              label="메모 내용"
              height={40}
            />
          </div>

          <Separator className="border-t" />

          <div className="w-full">
            <h2 className="pb-1 text-sm font-semibold">첨부서류</h2>
            <FlexBox>
              <RHF.MultiFiles
                onFilesChange={handleFilesChange}
                onServerFileRemove={handleServerFileRemove}
                initialFiles={paperFiles}
                onDownload={downloadFile}
                onError={(msg) => openAlert({ message: msg })}
              />
            </FlexBox>
          </div>
        </FlexBox>
      </FormDialog>
    </FormProvider>
  );
};;;
