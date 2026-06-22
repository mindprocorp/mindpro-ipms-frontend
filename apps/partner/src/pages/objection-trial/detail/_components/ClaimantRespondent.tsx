import {
  Button,
  Checkbox,
  CustomTooltip,
  DataTable,
  FlexBox,
  getColumns,
  Icons,
  RHF,
  Separator,
  cn,
  Label,
  Input,
  validateFile,
} from "@repo/ui";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import type { ObjectionTrialFormInput } from "@shared/schema/objection-trial/objectionTrialSchema.ts";
import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox";
import FlatItem from "@shared/ui/tab/ui/FlatItem";
import { useFormContext, useFieldArray, type FieldArrayWithId, type Path } from "react-hook-form";
import { useState } from "react";
import { Modal01 } from "@pages/pub/files";
import type { ColumnDef } from "@tanstack/react-table";
import type { FileItem } from "@shared/api/objection-trial/objectionTrialApi";
import {
  type InputKeyInfoType,
  type SuccessData,
  UserModal,
} from "@pages/common/modal/user/UserModal";
import React from "react";
import { formatDate } from "@shared/util/formatUtil";
import { selectColumn } from "@shared/util/selectColumn";
import { useMutation } from "@tanstack/react-query";
import { objectionTrialQueries } from "@shared/query/objection-trial/queries";

// 원심하급심 테이블 컬럼 정의
type ConflictResultItem = ObjectionTrialFormInput["cftResultList"]["conflictResultList"][number];
type ConflictResultRow = FieldArrayWithId<ObjectionTrialFormInput, "cftResultList.conflictResultList">;

const lowerCourtColumns: ColumnDef<ConflictResultRow>[] = [
  selectColumn<ConflictResultRow>(36),

  {
    accessorKey: "judgmentCaseNo",
    header: "판결사건번호",
    size: 150,
  },
  {
    accessorKey: "resultDecisionDate",
    header: "판결일",
    size: 120,
    cell: ({ getValue }) => <div>{formatDate(getValue())}</div>,
  },
  {
    accessorKey: "judgmentContent",
    header: "판결내용",
    size: 200,
  },
  {
    id: "judgmentCategory",
    header: "판결구분",
    size: 100,
    cell: ({ row }) => row.original.judgmentCategory?.codeName || row.original.judgmentCategory?.code || "",
  },
  {
    accessorKey: "judgmentSearchUrl",
    header: "판결문 경로",
    size: 150,
  },
  {
    accessorKey: "note",
    header: "비고",
    size: 150,
  },
];

interface ClaimantRespondentProps {
  conflictSeq?: string;
  onImageSelect?: (files: {
    appTrademarkFile?: File | null;
    citedTrademarkFile?: File | null;
  }) => void;
  cftFileList?: { fileList: FileItem[] } | null;
}

type TabType = "lowerCourt" | "image";

const ClaimantRespondent = ({
  conflictSeq,
  onImageSelect,
  cftFileList,
}: ClaimantRespondentProps) => {
  const [modal01Open, setModal01Open] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("lowerCourt");
  const [appTrademarkPreview, setAppTrademarkPreview] = useState<string | null>(null);
  const [citedTrademarkPreview, setCitedTrademarkPreview] = useState<string | null>(null);
  const [isAppTrademarkDeleted, setIsAppTrademarkDeleted] = useState(false);
  const [isCitedTrademarkDeleted, setIsCitedTrademarkDeleted] = useState(false);

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const { openAlert } = useAlertStore();
  const [editData, setEditData] = useState<ConflictResultItem | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const { control, setValue } = useFormContext<ObjectionTrialFormInput>();
  const columns = getColumns(lowerCourtColumns);

  const deleteImageMutation = useMutation(objectionTrialQueries.deleteConflictFile());

  const [isUserOpenModal, setIsUserOpenModal] = useState(false);
  const [inputKeyInfo, setInputKeyInfo] = useState<InputKeyInfoType>({
    inputKey: "",
    inputName: "",
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

  const onUserSuccess = (rtnData: SuccessData) => {
    setValue(rtnData.input.inputKey as Path<ObjectionTrialFormInput>, rtnData.userInfo[0].id, { shouldValidate: true });
    setValue(rtnData.input.inputName as Path<ObjectionTrialFormInput>, rtnData.userInfo[0].name, { shouldValidate: true });
  };

  const { fields, append, remove, update } = useFieldArray<ObjectionTrialFormInput>({
    control,
    name: "cftResultList.conflictResultList",
  });

  const buttonStyle = `
    bg-p-color-1 text-white flex justify-center items-center text-sm p-1.5 rounded-[4px]
    cursor-pointer hover:bg-p-color-1/90
  `;

  const handleAppTrademarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateFile(file, { accept: "image/gif,image/jpeg,image/png" });
      if (!validation.isValid) {
        openAlert({ message: validation.message });
        return;
      }
      onImageSelect?.({ appTrademarkFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setAppTrademarkPreview(reader.result as string);
        setIsAppTrademarkDeleted(false);
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  const handleCitedTrademarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateFile(file, { accept: "image/gif,image/jpeg,image/png" });
      if (!validation.isValid) {
        openAlert({ message: validation.message });
        return;
      }
      onImageSelect?.({ citedTrademarkFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setCitedTrademarkPreview(reader.result as string);
        setIsCitedTrademarkDeleted(false);
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  const handleRowClick = (row: any) => {
    const rowData = row.original;
    const index = fields.findIndex((f) => f.id === row.id);
    setEditData(rowData);
    setEditIndex(index);
    setModal01Open(true);
  };

  // 원심하급심 삭제
  const handleDeleteSelected = () => {
    const selectedIds = Object.keys(rowSelection).filter((key) => rowSelection[key]);

    // id로 index 찾아서 삭제 (역순으로)
    const selectedIndexes = selectedIds
      .map((id) => fields.findIndex((field) => field.id === id))
      .filter((index) => index !== -1)
      .sort((a, b) => b - a);

    selectedIndexes.forEach((index) => {
      remove(index);
    });
    setRowSelection({});
  };

  // fileList에서 이미지 URL 조회
  const appTrademarkFile = cftFileList?.fileList?.find(f => f.docNm === "출원상표");
  const citedTrademarkFile = cftFileList?.fileList?.find(f => f.docNm === "인용상표");
  
  const appTrademarkUrl = !isAppTrademarkDeleted ? appTrademarkFile?.fileUrl : null;
  const citedTrademarkUrl = !isCitedTrademarkDeleted ? citedTrademarkFile?.fileUrl : null;

  const handleDeleteImage = (type: "app" | "cited") => {
    const isApp = type === "app";
    const preview = isApp ? appTrademarkPreview : citedTrademarkPreview;
    const fileSeq = isApp ? appTrademarkFile?.fileSeq : citedTrademarkFile?.fileSeq;

    // 아직 저장 안 된 로컬 미리보기만 있는 경우
    if (preview) {
      if (isApp) {
        setAppTrademarkPreview(null);
        onImageSelect?.({ appTrademarkFile: null });
      } else {
        setCitedTrademarkPreview(null);
        onImageSelect?.({ citedTrademarkFile: null });
      }
      return;
    }

    // 서버에 저장된 파일 삭제
    if (!fileSeq) {
      openAlert({ message: "삭제할 이미지 정보를 찾을 수 없습니다." });
      return;
    }

    if (!conflictSeq) {
      openAlert({ message: "사건 정보를 찾을 수 없습니다." });
      return;
    }

    openAlert({
      message: `${isApp ? "상표" : "인용상표"} 이미지를 삭제하시겠습니까?`,
      confirmText: "삭제",
      cancelText: "취소",
      showCancel: true,
      onConfirm: () => {
        deleteImageMutation.mutate(
          { conflictSeq, fileSeq },
          {
            onSuccess: () => {
              if (isApp) {
                setAppTrademarkPreview(null);
                setIsAppTrademarkDeleted(true);
                onImageSelect?.({ appTrademarkFile: null });
              } else {
                setCitedTrademarkPreview(null);
                setIsCitedTrademarkDeleted(true);
                onImageSelect?.({ citedTrademarkFile: null });
              }
              openAlert({ message: "이미지가 삭제되었습니다.", showCancel: false });
            },
            onError: () => {
              openAlert({ message: "이미지 삭제에 실패했습니다. 다시 시도해주세요." });
            },
          }
        );
      },
    });
  };

  return (
    <>
      <FormUnitBox
        vertical
        boxfull
        title="청구/피청구인 정보"
        className="[&>div>h2]:text-p-color-3 [&>div]:first-of-type:bg-p-color-3/5"
      >
        <RHF.Input
          control={control}
          name="cftLitigantInfo.introducer"
          label="소개자"
          className="[&>div]:max-w-[calc(100%-80px)]"
          orientation="horizontal"
          maxLength={30}
        />

        <Separator className="my-2 border-t" />

        <FlexBox className="[&>div]:flex-1">
          <UnitInnerBox>
            <FlexBox className="justify-between">
              <BoxTitle title="청구인" />
              <FlexBox className="flex-0 [&>div]:justify-end [&>div]:gap-2 [&>div>div]:min-h-8">
                <RHF.FormRadio
                  control={control}
                  name="cftLitigantInfo.petitionerType"
                  items={[
                    {
                      value: "Y",
                      label: "원고",
                    },
                    {
                      value: "N",
                      label: "피고",
                    },
                  ]}
                  height={7}
                  size="sm"
                />
              </FlexBox>
            </FlexBox>
            <RHF.FormField gap={2} vertical>
              <RHF.Input
                control={control}
                name="cftLitigantInfo.petitioner.userName"
                actions={
                  <>
                    <CustomTooltip message="선택해주세요">
                      <Button
                        className="w-5"
                        onClick={() =>
                          onClickUserModal(
                            "cftLitigantInfo.petitioner.userSeq",
                            "cftLitigantInfo.petitioner.userName",
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
                control={control}
                name="cftLitigantInfo.petitioner.userSeq"
                type={"hidden"}
              />
              <RHF.FormTextarea
                control={control}
                name="cftLitigantInfo.petitionerMemo"
                label="메모"
                className="w-full"
                maxLength={2000}
              />
            </RHF.FormField>
          </UnitInnerBox>

          <UnitInnerBox className="bg-info-bg">
            <FlexBox className="justify-between">
              <BoxTitle title="피청구인" />
              <FlexBox className="flex-0 [&>div]:justify-end [&>div]:gap-2 [&>div>div]:min-h-8">
                <RHF.FormRadio
                  control={control}
                  name="cftLitigantInfo.respondentType"
                  items={[
                    {
                      value: "Y",
                      label: "원고",
                    },
                    {
                      value: "N",
                      label: "피고",
                    },
                  ]}
                  height={7}
                  size="sm"
                />
              </FlexBox>
            </FlexBox>
            <RHF.FormField gap={2} vertical>
              <RHF.Input
                control={control}
                name="cftLitigantInfo.respondent"
                maxLength={30}
              />
              <RHF.FormTextarea
                control={control}
                name="cftLitigantInfo.respondentMemo"
                label="메모"
                className="w-full"
                maxLength={2000}
              />
            </RHF.FormField>
          </UnitInnerBox>
        </FlexBox>

        <FlexBox className="border-border-100 justify-between gap-0 border-b">
          <FlexBox className="gap-4">
            <FlatItem
              label="원심하급심"
              value="lowerCourt"
              active={activeTab}
              onClick={() => setActiveTab("lowerCourt")}
            />
            <FlatItem
              label="이미지"
              value="image"
              active={activeTab}
              onClick={() => setActiveTab("image")}
            />
          </FlexBox>

          {activeTab === "lowerCourt" && (
            <div className="flex gap-1">
              <Button size="h24" variant="blue" onClick={() => { setEditData(null); setEditIndex(null); setModal01Open(true); }}>
                <Icons.Plus />
                추가
              </Button>
              <Button
                size="h24"
                onClick={handleDeleteSelected}
                disabled={Object.values(rowSelection).filter(Boolean).length === 0}
              >
                <Icons.Trash2 />
                삭제
              </Button>
            </div>
          )}
        </FlexBox>

        {activeTab === "lowerCourt" ? (
          <DataTable
            data={fields}
            columns={lowerCourtColumns}
            className="h-70"
            enableRowSelection
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            getRowId={(row) => row.id}
            onRowClick={handleRowClick}
          />
        ) : (
          /* 이미지 영역 */
          <div className="grid grid-cols-2 gap-4 p-4">
            {/* 상표 이미지 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">상표 이미지</Label>
              <div className="border-border-100 bg-bg-100 relative group flex h-47.5 w-full items-center justify-center overflow-hidden rounded-xl border">
                {appTrademarkPreview ? (
                  <img
                    src={appTrademarkPreview}
                    alt="상표 이미지"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : appTrademarkUrl ? (
                  <img
                    src={appTrademarkUrl}
                    alt="상표 이미지"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <Icons.Image className="size-12 opacity-30" />
                )}
                
                {(appTrademarkPreview || appTrademarkUrl) && (
                  <button
                    type="button"
                    onClick={() => handleDeleteImage("app")}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors"
                    title="이미지 삭제"
                  >
                    <Icons.X className="size-3.5" />
                  </button>
                )}
              </div>
              <Label htmlFor="appTrademarkFileInline" className={cn("[&>input]:hidden", buttonStyle)}>
                <Icons.Upload className="size-4" />
                파일등록
                <Input
                  id="appTrademarkFileInline"
                  type="file"
                  accept="image/gif,image/jpeg,image/png"
                  onChange={handleAppTrademarkChange}
                />
              </Label>
              <p className="text-p-color-2 text-xs">
                10M 이하의 gif, jpeg, png 파일만 등록가능 합니다.
              </p>
            </div>

            {/* 인용상표 이미지 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">인용상표 이미지</Label>
              <div className="border-border-100 bg-bg-100 relative group flex h-47.5 w-full items-center justify-center overflow-hidden rounded-xl border">
                {citedTrademarkPreview ? (
                  <img
                    src={citedTrademarkPreview}
                    alt="인용상표 이미지"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : citedTrademarkUrl ? (
                  <img
                    src={citedTrademarkUrl}
                    alt="인용상표 이미지"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <Icons.Image className="size-12 opacity-30" />
                )}

                {(citedTrademarkPreview || citedTrademarkUrl) && (
                  <button
                    type="button"
                    onClick={() => handleDeleteImage("cited")}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors"
                    title="이미지 삭제"
                  >
                    <Icons.X className="size-3.5" />
                  </button>
                )}
              </div>
              <Label
                htmlFor="citedTrademarkFileInline"
                className={cn("[&>input]:hidden", buttonStyle)}
              >
                <Icons.Upload className="size-4" />
                파일등록
                <Input
                  id="citedTrademarkFileInline"
                  type="file"
                  accept="image/gif,image/jpeg,image/png"
                  onChange={handleCitedTrademarkChange}
                />
              </Label>
              <p className="text-p-color-2 text-xs">
                10M 이하의 gif, jpeg, png 파일만 등록가능 합니다.
              </p>
            </div>
          </div>
        )}

        {/* 원심하급심 입력 팝업 */}
        <Modal01
          open={modal01Open}
          onOpenChange={setModal01Open}
          title={editData ? "원심하급심 수정" : "원심하급심 입력"}
          editData={editData}
          onSuccess={(data) => {
            if (editIndex !== null) {
              update(editIndex, data);
            } else {
              append(data);
            }
          }}
        />
      </FormUnitBox>

      <UserModal
        open={isUserOpenModal}
        onOpenChange={onOpenChange}
        title="담당자 선택"
        input={inputKeyInfo}
        onSuccess={onUserSuccess}
      />
    </>
  );
};

export default ClaimantRespondent;
