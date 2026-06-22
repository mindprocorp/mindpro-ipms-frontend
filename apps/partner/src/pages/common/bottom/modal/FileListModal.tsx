import { CustomScrollArea, FlexBox, FormDialog, RHF, Separator } from "@repo/ui";
import React, { useCallback, useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import { useFileListModalForm } from "@shared/schema/common/modal/modalform.ts";
import { useMutation } from "@tanstack/react-query";
import { bottomQueries } from "@shared/query/common/bottomQueries.ts";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import type { CodeRequestTypeNew, CodeSelectOption } from "@shared/api/common/commApi.ts";
import {
  type FileListModalFormInput,
  type FileListModalFormOutput,
  fileListModalSchema,
} from "@shared/schema/common/modal/fileListModalSchema.ts";
import { commonQueries } from "@shared/query/common/queries.ts";
import { FILE_LIST } from "@shared/enum/comCodeType.ts";
import { getCodeList } from "@shared/util/codeUtils.ts";
import { mapToOptionNew } from "@shared/util/stringUtil.ts";
import { downloadFile } from "@shared/util/fileUtil";
import type {
  FileItem,
  ServerFileItem,
} from "../../../../../../../packages/ui/src/components/ui/grouping";
import { z } from "zod";

type SuccessData = {
  callbackData: any;
};

type FileListModalProps = {
  propData?: any;
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (rtnData: SuccessData) => void;
  rowData?: any;
};

export const FileListModal = ({
  title,
  open,
  onOpenChange,
  onSuccess,
  propData,
  rowData,
}: FileListModalProps) => {
  const form = useFileListModalForm();
  const createFileListMutation = useMutation(bottomQueries.createFile());
  const getFileListDetailMutation = useMutation(bottomQueries.getFileListDetail());
  const getCommonCodeNewMutation = useMutation(commonQueries.getCommonCodeNew());
  const [attachDocDivList, setAttachDocDivList] = useState<CodeSelectOption[]>([]);
  const { openAlert } = useAlertStore();
  const [paperFiles, setPaperFiles] = useState<ServerFileItem[]>([]);

  // 수정/등록 모드 구분
  const [isEditMode, setIsEditMode] = useState(false);

  // 수정 모드에서 삭제된 서버 파일 seq 목록
  const [deletedFileSeqs, setDeletedFileSeqs] = useState<string[]>([]);

  const getCommCodeNew = useCallback(() => {
    const codeRequest: CodeRequestTypeNew = {
      grpCdList: [FILE_LIST.DOC_TYPE_CD],
    };

    getCommonCodeNewMutation.mutate(codeRequest, {
      onSuccess: (response) => {
        const codeDataList = response.data;
        const setupCodes = (codeKey: string, setter: (codes: any[]) => void) => {
          const codeList = getCodeList(codeKey, codeDataList);
          setter(mapToOptionNew(codeList));
        };
        setupCodes(FILE_LIST.DOC_TYPE_CD, setAttachDocDivList);
      },
    });
  }, [open]);

  // TODO: API 완성 후 상세조회 함수 연결
  const getFileListDetail = (tblSeq: string, fileMappSeq : string) => {
    const param = {
      tblSeq,
      fileMappSeq,
    };
    getFileListDetailMutation.mutate(
      param,
      {
        onSuccess: (response) => {
          const detailData = response.data;

          // 서류구분 매핑: fileKindCode -> attachDocDiv
          const formData = {
            ...detailData,
            attachDocDiv: detailData.fileKindCode,
            files: [], // 기존 파일은 paperFiles 상태로 관리하므로 폼 상태에서는 비움 (Zod File 인스턴스 검증 충돌 방지)
          };
          form.reset(formData);

          // 파일 정보 매핑
          if (detailData.files && detailData.files.length > 0) {
            const files: ServerFileItem[] = detailData.files.map((file: any) => ({
              fileSeq: file.fileSeq,
              fileName: file.fileName,
              fileSize: file.fileSize,
              fileUrl: file.fileViewUrl,
              docSeq: detailData.docSeq,
              docNm: detailData.docName,
            }));
            setPaperFiles(files);
          } else if (detailData.fileName) {
            // 호환성 유지: 단건 필드만 있는 경우
            const files: ServerFileItem[] = [
              {
                fileSeq: detailData.docCode,
                fileName: detailData.fileName,
                fileSize: detailData.fileSize,
                fileUrl: detailData.fileViewUrl,
                docSeq: detailData.docSeq,
                docNm: detailData.docName,
              },
            ];
            setPaperFiles(files);
          } else {
            setPaperFiles([]);
          }
        },
      },
    );
  };

  useEffect(() => {
    const isEdit = !!rowData?.fileMappSeq;
    setIsEditMode(isEdit);

    if (open) {
      getCommCodeNew();

      if (isEdit) {
        // 수정 모드: rowData로 form 채우기
        getFileListDetail(propData, rowData.fileMappSeq);
      } else {
        // 등록 모드: 초기화
        form.reset();
        form.setValue("tblSeq", propData);
        form.setValue("docSeq", "393");
        form.setValue("files", []);
        setPaperFiles([]);
      }
      setDeletedFileSeqs([]);
    }
  }, [open, rowData, propData, form]);

  const onSubmit = (values: FileListModalFormInput) => {
    const modeText = isEditMode ? "수정" : "저장";

    openAlert({
      className: "w-[400px]",
      message: `${modeText}하시겠습니까?`,
      confirmText: "확인",
      cancelText: "취소",
      onConfirm: () => {
        // 수정 모드일 때 tblSeq, fileMappSeq 포함
        const payload = isEditMode
          ? {
              ...values,
              deletedFileSeqList: deletedFileSeqs,
            }
          : values;

          createFileListMutation.mutate(payload, {
            onSuccess: (response) => {
              console.log("[성공]", response);
              onOpenChange(false);
              onSuccess?.({
                callbackData: "FILE_LIST",
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
  };

  const onError = (errors: any) => {
    console.log(" Zod errors:", errors);
    const errorEntries = Object.entries(errors);
    if (errorEntries.length > 0) {
      const [field, error] = errorEntries[0];
      const message = (error as any).message || "입력값을 확인해주세요.";
      openAlert({
        message: `${message}`,
        confirmText: "확인",
      });
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

  return (
    <FormProvider {...form}>
      <FormDialog
        // 수정/등록 타이틀 분기
        title={title ?? (isEditMode ? "파일목록 수정" : "파일목록 등록")}
        onSubmit={form.handleSubmit(onSubmit, onError)}
        // 버튼 텍스트 분기
        submitText={isEditMode ? "수정" : "저장"}
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-200!"
      >
        <div className="min-w-0 space-y-4">
          <CustomScrollArea className="h-140">
            <FlexBox vertical className="gap-4 pt-3">
              <div className="w-full">
                <FlexBox>
                  <RHF.FormSelect
                    control={form.control}
                    name="attachDocDiv"
                    items={attachDocDivList}
                    label="서류구분"
                    className="w-30"
                  />
                  <RHF.FormDatePicker
                    control={form.control}
                    name="inputCreateAt"
                    label="등록일자"
                    className="w-30"
                  />
                </FlexBox>
              </div>

              <Separator className="border-t" />

              <div className="w-full">
                <h2 className="pb-1 text-sm font-semibold">요약</h2>
                <FlexBox>
                  <RHF.FormTextarea control={form.control} name="summary" />
                </FlexBox>
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
          </CustomScrollArea>
        </div>
      </FormDialog>
    </FormProvider>
  );
};
