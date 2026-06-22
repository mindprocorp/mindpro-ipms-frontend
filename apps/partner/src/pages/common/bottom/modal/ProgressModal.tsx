import {
  Button,
  CustomScrollArea,
  CustomTooltip,
  FlexBox,
  FormDialog,
  Icons,
  RHF,
  Separator,
} from "@repo/ui";
import React, { useCallback, useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";
import { useProgressModalForm } from "@shared/schema/common/modal/modalform.ts";
import {
  type ProgressModalFormInput,
  type ProgressModalFormOutput,
  progressModalSchema,
} from "@shared/schema/common/modal/progressModalSchema.ts";
import { useMutation } from "@tanstack/react-query";
import { bottomQueries } from "@shared/query/common/bottomQueries.ts";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import type { CodeRequestTypeNew, CodeSelectOption } from "@shared/api/common/commApi.ts";
import { mapToDocOption, mapToOptionNew } from "@shared/util/stringUtil.ts";
import { commonQueries } from "@shared/query/common/queries.ts";
import type {
  FileItem,
  ServerFileItem,
} from "../../../../../../../packages/ui/src/components/ui/grouping";
import {
  type InputKeyInfoType,
  type SuccessData,
  UserModal,
} from "@pages/common/modal/user/UserModal.tsx";
import { PROGRESS } from "@shared/enum/comCodeType.ts";
import { getCodeList } from "@shared/util/codeUtils.ts";
import { downloadFile } from "@shared/util/fileUtil";
import { z } from "zod";

type ModalSuccessData = {
  callbackData: any;
};

type ProgressModalProps = {
  propData?: any;
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (rtnData: ModalSuccessData) => void;
  rowData?: any;
  callbackData?: string;
};

export const ProgressModal = ({
  title,
  open,
  onOpenChange,
  onSuccess,
  propData,
  rowData,
  callbackData = "PROGRESS",
}: ProgressModalProps) => {
  const form = useProgressModalForm();
  const createProgressMutation = useMutation(bottomQueries.createProgress());
  const getProgressDetailMutation = useMutation(bottomQueries.getProgressDetail());
  const getCommonDocMutation = useMutation(commonQueries.getCommonDoc());
  const getCommonCodeNewMutation = useMutation(commonQueries.getCommonCodeNew());
  const [docList, setDocList] = useState<CodeSelectOption[]>([]);
  const [submitDocList, setSubmitDocList] = useState<CodeSelectOption[]>([]);
  const [targetList, setTargetList] = useState<CodeSelectOption[]>([]);
  const { openAlert } = useAlertStore();
  const [isUserOpenModal, setIsUserOpenModal] = React.useState(false);
  // state 추가
  const [paperFiles, setPaperFiles] = useState<ServerFileItem[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteFileSeqList, setDeleteFileSeqList] = useState<string[]>([]);

  const [inputKeyInfo, setInputKeyInfo] = React.useState<InputKeyInfoType>({
    inputKey: "",
    inputName: "",
  });

  //let isEditMode = false;

  const onSubmit = (values: ProgressModalFormInput) => {
    try {
      const vaildData: ProgressModalFormOutput = progressModalSchema.parse(values);
      const modeText = isEditMode ? "수정" : "저장";

      openAlert({
        className: "w-[400px]",
        message: `${modeText}하시겠습니까?`,
        confirmText: "확인",
        cancelText: "취소",
        onConfirm: () => {
          const payload = isEditMode 
            ? { ...vaildData, progressSeq: rowData.progressSeq, deleteFileSeqList } 
            : { ...vaildData, deleteFileSeqList };

          createProgressMutation.mutate(payload, {
            onSuccess: (response) => {
              console.log("[성공]", response);
              // 모달을 먼저 닫고 알럿을 띄우는 것이 레이어 충돌 방지에 안전함
              onOpenChange(false);
              onSuccess?.({
                callbackData: callbackData || "PROGRESS",
              });

              setTimeout(() => {
                openAlert({
                  className: "w-[400px]",
                  message: `${modeText}완료하였습니다`,
                  confirmText: "확인",
                  onConfirm: () => {
                    useAlertStore.getState().close();
                  },
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

  const getProgressDetail = (progressSeq: string) => {
    getProgressDetailMutation.mutate(progressSeq, {
      onSuccess: (response) => {
        console.log("상세조회 ", response);
        const detailData = response.data;
        // @ts-ignore
        form.reset(detailData);
        form.setValue("tblSeq", propData);
        // 첨부파일은 별도 초기화 (File 객체는 API 응답에 없으므로)
        // PaperFiles 세팅

        form.setValue("targetFiles", []);
        setPaperFiles(detailData.PaperFiles ?? []);
      },
    });
  };

  const getCommCodeNew = useCallback(() => {
    const codeRequest: CodeRequestTypeNew = {
      grpCdList: [PROGRESS.TARGET_TYPE],
    };

    getCommonCodeNewMutation.mutate(codeRequest, {
      onSuccess: (response) => {
        console.log("code list ", response);

        const codeDataList = response.data;

        const setupCodes = (codeKey: string, setter: (codes: any[]) => void) => {
          const codeList = getCodeList(codeKey, codeDataList);
          setter(mapToOptionNew(codeList));
        };
        setupCodes(PROGRESS.TARGET_TYPE, setTargetList);
      },
    });
  }, [open]);

  const onError = (errors: any) => {
    console.log(" Zod errors:", errors);
  };

  const getCommDoc = (entryType: string, patType: string, docDiv: string) => {
    const codeRequest = {
      entryType,
      patType,
      docDiv,
    };

    getCommonDocMutation.mutate(codeRequest, {
      onSuccess: (response) => {
        console.log("doc code list ", response);

        const codeDataList = response.data.list;

        setDocList(mapToDocOption(codeDataList));

        getCommSubmitDoc("10", "20", "10");
      },
    });
  };

  const getCommSubmitDoc = (entryType: string, patType: string, docDiv: string) => {
    const codeRequest = {
      entryType,
      patType,
      docDiv,
    };

    getCommonDocMutation.mutate(codeRequest, {
      onSuccess: (response) => {
        console.log("submit code list ", response);

        const codeDataList = response.data.list;

        setSubmitDocList(mapToDocOption(codeDataList));
      },
    });
  };

  useEffect(() => {
    const isEdit = !!rowData?.progressSeq;
    setIsEditMode(isEdit);

    if (open) {
      setDeleteFileSeqList([]);
      form.reset();
      getCommDoc("10", "10", "20");
      getCommCodeNew();
      if (isEdit) {
        // 수정 모드: rowData로 form 채우기
        getProgressDetail(rowData.progressSeq);
      } else {
        // 등록 모드: form 초기화 후 기본값 세팅
        form.reset();
        form.setValue("tblSeq", propData);
        form.setValue("targetFiles", []);
        setPaperFiles([]); // 초기화
      }
    }
  }, [open]);

  const handleFilesChange = (files: FileItem[]) => {
    const fileList: File[] = [];
    for (const file of files) {
      fileList.push(file.FileObj);
    }
    form.setValue("targetFiles", fileList);
  };

  const onClickUserModal = (inputKey: string, inputName: string) => {
    setIsUserOpenModal(true);
    setInputKeyInfo({
      inputKey,
      inputName,
    });
  };

  const onUserModalSuccess = (rtnData: SuccessData) => {
    console.log(rtnData.userInfo[0].name);
    form.setValue(rtnData.input.inputKey as any, rtnData.userInfo[0].id, { shouldValidate: true });
    form.setValue(rtnData.input.inputName as any, rtnData.userInfo[0].name, {
      shouldValidate: true,
    });
  };

  const onUserModalOpenChange = (isOpen: boolean) => {
    setIsUserOpenModal(isOpen);
  };

  return (
    <>
      <FormProvider {...form}>
        <FormDialog
            // 수정/등록 타이틀 분기 (title prop 없을 때 자동 처리)

            title={title ?? (isEditMode ? "진행사항 수정" : "진행사항 등록")}
            onSubmit={form.handleSubmit(onSubmit, onError)}
            // 버튼 텍스트 분기
            submitText={isEditMode ? "수정" : "저장"}
            open={open}
            onOpenChange={onOpenChange}
            className="max-w-300!"
          >
          <CustomScrollArea className="h-140">
                <FlexBox vertical className="gap-4 pt-3">
                  <div className="w-full">
                    <h2 className="pb-1 text-sm font-semibold">접수사항</h2>
                    <FlexBox>
                      <RHF.FormDatePicker
                        control={form.control}
                        name="noticeDate"
                        label="통지일"
                        className="w-30"
                        important
                      />
                      <RHF.FormDatePicker
                        control={form.control}
                        name="agentReceiptDate"
                        label="대리인 접수일"
                        className="w-30"
                        important
                      />
                      <RHF.FormSelect
                        control={form.control}
                        name="receiptDoc.docSeq"
                        items={docList}
                        label="접수서류"
                        important
                      />
                      <RHF.Input
                        control={form.control}
                        name="examiner.userName"
                        label="심사관"
                        important
                        actions={
                          <>
                            <CustomTooltip message="선택하거나 입력 하세요">
                              <Button
                                className="w-5"
                                onClick={() =>
                                  onClickUserModal("examiner.userSeq", "examiner.userName")
                                }
                              >
                                <Icons.Search className="size-3" />
                              </Button>
                            </CustomTooltip>
                          </>
                        }
                        className="w-30"
                        inputDisabled
                      />

                      <RHF.Input control={form.control} name="examiner.userSeq" type={"hidden"} />
                      <RHF.Input
                        control={form.control}
                        name="receiptDocContent"
                        label="접수서류내용"
                        important
                      />
                    </FlexBox>
                  </div>

                  <Separator className="border-t" />

                  <div className="w-full">
                    <h2 className="pb-1 text-sm font-semibold">보고사항</h2>
                    <FlexBox className="mb-2">
                      <RHF.FormDatePicker
                        control={form.control}
                        name="receiptReportLimitDate"
                        label="접수보고마감일"
                        className="w-30"
                        important
                      />
                      <RHF.FormDatePicker
                        control={form.control}
                        name="receiptReportDate"
                        label="접수보고일"
                        className="w-30"
                        important
                      />
                      <RHF.Input
                        control={form.control}
                        name="receiptReportManager.userName"
                        label="접수보고 담당자"
                        important
                        actions={
                          <>
                            <CustomTooltip message="선택하거나 입력 하세요">
                              <Button
                                className="w-5"
                                onClick={() =>
                                  onClickUserModal(
                                    "receiptReportManager.userSeq",
                                    "receiptReportManager.userName",
                                  )
                                }
                              >
                                <Icons.Search className="size-3" />
                              </Button>
                            </CustomTooltip>
                          </>
                        }
                        inputDisabled
                      />

                      <RHF.Input
                        control={form.control}
                        name="receiptReportManager.userSeq"
                        type={"hidden"}
                      />

                      <RHF.FormDatePicker
                        control={form.control}
                        name="reviewOpinionLimitDate"
                        label="검토의견 마감일"
                        className="w-30"
                        important
                      />
                      <RHF.FormDatePicker
                        control={form.control}
                        name="reviewReportDate"
                        label="검토 보고일"
                        className="w-30"
                        important
                      />
                      <RHF.Input
                        control={form.control}
                        name="reviewReportManager.userName"
                        label="검토보고 담당자"
                        important
                        actions={
                          <>
                            <CustomTooltip message="선택하거나 입력 하세요">
                              <Button
                                className="w-5"
                                onClick={() =>
                                  onClickUserModal(
                                    "reviewReportManager.userSeq",
                                    "reviewReportManager.userName",
                                  )
                                }
                              >
                                <Icons.Search className="size-3" />
                              </Button>
                            </CustomTooltip>
                          </>
                        }
                        inputDisabled
                      />
                      <RHF.Input
                        control={form.control}
                        name="reviewReportManager.userSeq"
                        type={"hidden"}
                      />

                      <RHF.FormDatePicker
                        control={form.control}
                        name="instructionDate"
                        label="지시일"
                        className="w-30"
                        important
                      />
                    </FlexBox>
                    <RHF.Input control={form.control} name="instructionContent" label="지시내용" important />
                  </div>

                  <Separator className="border-t" />

                  <div className="w-full">
                    <h2 className="pb-1 text-sm font-semibold">제출사항</h2>
                    <FlexBox className="mb-2">
                      <RHF.Input
                        control={form.control}
                        name="extensionCount"
                        label="기연"
                        className="w-30"
                        numericOnly
                        maxLength={100}
                      />
                      <RHF.FormDatePicker
                        control={form.control}
                        name="documentLimitDate"
                        label="서류마감일"
                        className="w-30"
                        important
                      />
                      <RHF.FormDatePicker
                        control={form.control}
                        name="documentSubmitDate"
                        label="서류제출일"
                        className="w-30"
                        important
                      />
                      <RHF.FormSelect
                        control={form.control}
                        name="submitDoc.docSeq"
                        items={submitDocList}
                        label="제출서류"
                        important
                      />

                      <RHF.FormSelect
                        control={form.control}
                        name="target.code"
                        items={targetList}
                        label="대상"
                        important
                      />

                      <RHF.Input control={form.control} name="deptName" label="부서" maxLength={100} important />
                      <RHF.Input
                        control={form.control}
                        name="submitManager.userName"
                        label="제출 담당자"
                        important
                        actions={
                          <>
                            <CustomTooltip message="선택하거나 입력 하세요">
                              <Button
                                className="w-5"
                                onClick={() =>
                                  onClickUserModal(
                                    "submitManager.userSeq",
                                    "submitManager.userName",
                                  )
                                }
                              >
                                <Icons.Search className="size-3" />
                              </Button>
                            </CustomTooltip>
                          </>
                        }
                        inputDisabled
                      />

                      <RHF.Input
                        control={form.control}
                        name="submitManager.userSeq"
                        type={"hidden"}
                      />

                      <RHF.FormDatePicker
                        control={form.control}
                        name="submitReportLimitDate"
                        label="제출보고 마감일"
                        className="w-30"
                        important
                      />
                      <RHF.FormDatePicker
                        control={form.control}
                        name="submitReportDate"
                        label="제출 보고일"
                        className="w-30"
                        important
                      />
                    </FlexBox>
                    <FlexBox className="mb-2">
                      <RHF.Input
                        control={form.control}
                        name="submitReportManager.userName"
                        label="제출보고 담당자"
                        className="w-30"
                        important
                        actions={
                          <>
                            <CustomTooltip message="선택하거나 입력 하세요">
                              <Button
                                className="w-5"
                                onClick={() =>
                                  onClickUserModal(
                                    "submitReportManager.userSeq",
                                    "submitReportManager.userName",
                                  )
                                }
                              >
                                <Icons.Search className="size-3" />
                              </Button>
                            </CustomTooltip>
                          </>
                        }
                        inputDisabled
                      />
                      <RHF.Input
                        control={form.control}
                        name="submitReportManager.userSeq"
                        type={"hidden"}
                      />
                    </FlexBox>
                  </div>

                  <Separator className="border-t" />

                  <div className="w-full">
                    <h2 className="pb-1 text-sm font-semibold">첨부서류</h2>
                    <FlexBox>
                      <RHF.MultiFiles 
                        onFilesChange={handleFilesChange} 
                        initialFiles={paperFiles} 
                        onServerFileRemove={(fileSeq) => setDeleteFileSeqList((prev) => [...prev, fileSeq])}
                        onDownload={downloadFile}
                        onError={(msg) => openAlert({ message: msg })}
                      />
                    </FlexBox>
                  </div>
                </FlexBox>
          </CustomScrollArea>
        </FormDialog>
      </FormProvider>

      <UserModal
        open={isUserOpenModal}
        onOpenChange={onUserModalOpenChange}
        title="담당자 선택"
        input={inputKeyInfo}
        onSuccess={onUserModalSuccess}
      />
    </>
  );
};
