import { BoxTab } from "@shared/ui/tab/ui/Tabs.tsx";
import { Button, FlexBox, Icons, RHF } from "@repo/ui";
import CustomBottomTabelRender from "@pages/domestic/detail/child/CustomBottomTableRender.tsx";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProgressModal } from "@pages/common/bottom/modal/ProgressModal.tsx";
import { CostModal } from "@pages/common/bottom/modal/CostModal.tsx";
import { GracePeriodModal } from "@pages/common/bottom/modal/GracePeriodModal.tsx";
import { PreferenceModal } from "@pages/common/bottom/modal/PreferenceModal.tsx";
import { MemoModal } from "@pages/common/bottom/modal/MemoModal.tsx";
import { RndModal } from "@pages/common/bottom/modal/RndModal.tsx";
import { FileListModal } from "@pages/common/bottom/modal/FileListModal.tsx";
import { RenewalModal } from "@pages/common/bottom/modal/RenewalModal.tsx";
import { ProductModal } from "@pages/common/bottom/modal/ProductModal.tsx";
import { RIGHT_TYPE } from "@shared/enum/domesticType.ts";
import { WrapperModal } from "@pages/common/bottom/modal/WrapperModal.tsx";
import PctForm from "@pages/overseas/etc/pct/PctForm.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import EpForm from "@pages/overseas/etc/ep/EpForm.tsx";
import NationalForm from "@pages/overseas/etc/national/NationalForm.tsx";
import MadridForm from "@pages/overseas/etc/madrid/MadridForm.tsx";
import DirectAppForm from "@pages/overseas/etc/direct-app/DirectAppForm.tsx";
import { useAlertStore } from "@shared/store/useAlertStore.ts";
import { LocarModal } from "@pages/common/bottom/modal/locar/LocarModal.tsx";
import DomesticBillForm from "@pages/bill/domestic/DomesticBillForm.tsx";
import OverseasBillForm from "@pages/bill/overseas/OverseasBillForm.tsx";
import ForeignBillForm from "@pages/bill/foreign/ForeignBillForm.tsx";
import { IdsModal } from "@pages/common/bottom/modal/IdsModal.tsx";
import { RequiredDocsModal } from "@pages/common/bottom/modal/RequiredDocsModal.tsx";
import { MaintenanceModal } from "@pages/common/bottom/modal/MaintenanceModal.tsx";
import {useMutation} from "@tanstack/react-query";
import {bottomQueries} from "@shared/query/common/bottomQueries.ts";
import { NewProductModal } from "@pages/common/bottom/modal/NewProductModal";

const tabs = [
  { label: "해외출원", value: "OVERSEAS" },
  { label: "진행사항", value: "PROGRESS" }, // 수정API 완료
  { label: "IDS", value: "IDS" }, // 수정완료
  { label: "구비서류", value: "REQUIRED_DOCS" }, // 수정완료
  { label: "유지비", value: "MAINTENANCE_FEE" }, //  수정완료
  { label: "연차관리", value: "COST" }, // 수정완료
  { label: "로카르노", value: "LOCAR" },
  { label: "공지예외", value: "GRACE_PERIOD" }, // 수정완료
  { label: "연구과제", value: "RND" }, // 수정완료
  { label: "우선권", value: "PREFERENCE" }, // 수정완료
  // { label: "요약/청구", value: "HARD_SUMMARY" }, // 특허/실용신안 요약/청구
  { label: "설명/요점", value: "SOFT_SUMMARY" }, // 디자인요약서
  { label: "전자포대", value: "FILE_LIST" }, // 수정중 전자포대 두개등록시? 문의해야함.
  { label: "메모", value: "MEMO" }, // 수정API 완료 파일이슈가있음.
  { label: "갱신관리", value: "RENEWAL" },
  { label: "지정상품", value: "PRODUCT" },
  { label: "청구관리", value: "CLAIM" },
  // { label: "업무관리", value: "WORK_MANAGE" },
];

type propsType = {
  type: string; // 국내/국외
  rightType?: string; // 권리
  appRoute?: string; // 출원 루트
  tblSeq: string | undefined; // 시퀀스
  onSaveAndProceed?: (tabValue: string) => void;
};

type tabType = {
  label: string;
  value: string;
};

export const SelectSchema = z.object({
  typeGb: z
    .string()
    .min(2, {
      message: "필수입력",
    })
    .default(""),
  billTypeGb: z
    .string()
    .min(2, {
      message: "필수입력",
    })
    .default(""),
});

export type SelectInput2 = z.input<typeof SelectSchema>;
/**
 * 하위 렌더링 페이지 분리
 * @constructor
 */
const CustomBottom = ({ type, rightType, appRoute, tblSeq, onSaveAndProceed }: propsType) => {
  const [tab, setTab] = useState<tabType[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [bottomTabActice, setBottomTabActice] = useState<string>("PROGRESS");

  useEffect(() => {
    console.log("[DEBUG] CustomBottom tblSeq updated:", tblSeq);
  }, [tblSeq]);

  useEffect(() => {
    const openTab = searchParams.get("openTab");
    const typeGbParam = searchParams.get("typeGb");
    const billTypeGbParam = searchParams.get("billTypeGb");

    if (openTab && tblSeq) {
      if (typeGbParam) setTypeGb(typeGbParam);
      if (billTypeGbParam) setBillTypeGb(billTypeGbParam);

      setBottomTabActice(openTab);
      // 모달을 열기 위한 딜레이 (탭 전환 후 열리도록)
      setTimeout(() => {
        openModalByTab(openTab);
      }, 100);
      
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("openTab");
      newParams.delete("typeGb");
      newParams.delete("billTypeGb");
      setSearchParams(newParams, { replace: true });
    }
  }, [tblSeq, searchParams, setSearchParams]);
  const [isProgressOpenModal, setIsProgressOpenModal] = React.useState(false);
  const [isCostOpenModal, setIsCostOpenModal] = React.useState(false);
  const [isGracePeriodOpenModal, setIsGracePeriodOpenModal] = React.useState(false);
  const [isPreferenceOpenModal, setIsPreferenceOpenModal] = React.useState(false);
  const [isMemoOpenModal, setIsMemoOpenModal] = React.useState(false);
  const [isRndOpenModal, setIsRndOpenModal] = React.useState(false);
  const [isFileListOpenModal, setIsFileListOpenModal] = React.useState(false);
  const [isRenewalOpenModal, setIsRenewalOpenModal] = React.useState(false);
  const [isProductOpenModal, setIsProductOpenModal] = React.useState(false);
  const [isOverseasOpenModal, setIsOverseasOpenModal] = React.useState(false);
  const [isIdsOpenModal, setIsIdsOpenModal] = React.useState(false);
  const [isClaimOpenModal, setIsClaimOpenModal] = React.useState(false);
  const [isWorkManageOpenModal, setIsWorkManageOpenModal] = React.useState(false);
  const [isRequiredDocsOpenModal, setIsRequiredDocsOpenModal] = React.useState(false);
  const [isMainTenanceOpenModal, setIsMainTenanceOpenModal] = React.useState(false);
  const [isLocarOpenModal, setIsLocarOpenModal] = React.useState(false);
  const [isRefresh, setIsRefresh] = React.useState(false);
  const [typeGb, setTypeGb] = React.useState("");
  const [billTypeGb, setBillTypeGb] = React.useState("");
  const [memoRowData, setMemoRowData] = React.useState<any>(null); //
  const [selectedRows, setSelectedRows] = React.useState<any[]>([]); // 이름 변경 및 범용 사용
  const deleteMemoMutation = useMutation(bottomQueries.deleteMemo());

  // 일괄 삭제 mutations 추가
  const multiDeleteProgressMutation = useMutation(bottomQueries.multiDeleteProgress());
  const multiDeleteMemoMutation = useMutation(bottomQueries.multiDeleteMemo());
  const multiDeleteGracePeriodMutation = useMutation(bottomQueries.multiDeleteGracePeriod());
  const multiDeleteCostMutation = useMutation(bottomQueries.multiDeleteCost());
  const multiDeletePreferenceMutation = useMutation(bottomQueries.multiDeletePreference());
  const multiDeleteRndMutation = useMutation(bottomQueries.multiDeleteRnd());
  const multiDeleteFileListMutation = useMutation(bottomQueries.multiDeleteFileList());
  const multiDeleteRenewalMutation = useMutation(bottomQueries.multiDeleteRenewal());
  const multiDeleteProductMutation = useMutation(bottomQueries.multiDeleteProduct());
  const multiDeleteLocarnoMutation = useMutation(bottomQueries.multiDeleteLocarno());
  const multiDeleteIdsMutation = useMutation(bottomQueries.multiDeleteIds());
  const multiDeleteRequiredDocMutation = useMutation(bottomQueries.multiDeleteRequiredDoc());
  const multiDeleteMaintenanceFeeMutation = useMutation(bottomQueries.multiDeleteMaintenanceFee());
  const deleteIncidentClaimsMutation = useMutation(bottomQueries.deleteIncidentClaims());

  const { openAlert } = useAlertStore();

  const form = useForm<SelectInput2>({
    resolver: zodResolver(SelectSchema),
    defaultValues: SelectSchema.parse({}),
  });
  const { watch, resetField, clearErrors, setValue } = form;

  const tabClick = (value: string) => {
    setBottomTabActice(value);
  };

  const openModalByTab = (tabValue: string) => {
    setMemoRowData(null);
    switch (tabValue) {
      case "PROGRESS": setIsProgressOpenModal(true); break;
      case "COST": setIsCostOpenModal(true); break;
      case "GRACE_PERIOD": setIsGracePeriodOpenModal(true); break;
      case "PREFERENCE": setIsPreferenceOpenModal(true); break;
      case "MEMO": setIsMemoOpenModal(true); break;
      case "RND": setIsRndOpenModal(true); break;
      case "FILE_LIST": setIsFileListOpenModal(true); break;
      case "RENEWAL": setIsRenewalOpenModal(true); break;
      case "PRODUCT": setIsProductOpenModal(true); break;
      case "LOCAR": setIsLocarOpenModal(true); break;
      case "OVERSEAS": setIsOverseasOpenModal(true); break;
      case "IDS": setIsIdsOpenModal(true); break;
      case "CLAIM": setIsClaimOpenModal(true); break;
      case "WORK_MANAGE": setIsWorkManageOpenModal(true); break;
      case "REQUIRED_DOCS": setIsRequiredDocsOpenModal(true); break;
      case "MAINTENANCE_FEE": setIsMainTenanceOpenModal(true); break;
    }
  };

  const addReg = () => {
    if (!tblSeq) {
      if (onSaveAndProceed) {
        onSaveAndProceed(bottomTabActice, watch("typeGb") || watch("billTypeGb"));
      } else {
        openAlert({
          message: "마스터 정보를 먼저 등록해주세요",
          confirmText: "확인",
        });
      }
      return;
    }
    const typeGb = watch("typeGb");
    if (typeGb) setTypeGb(typeGb);

    const billTypeGb = watch("billTypeGb");
    if (billTypeGb) setBillTypeGb(billTypeGb);

    if (type === "basic" && !typeGb && bottomTabActice === "OVERSEAS") {
      openAlert({
        className: "w-[400px]",
        message: "해외출원을 선택해주세요",
        confirmText: "확인",
      });
      return;
    }

    if (
      !billTypeGb &&
      bottomTabActice === "CLAIM"
    ) {
      openAlert({
        className: "w-[400px]",
        message: "청구를 선택해주세요",
        confirmText: "확인",
      });
      return;
    }

    openModalByTab(bottomTabActice);
  };

  const del = () => {
    if (!selectedRows.length) {
      openAlert({
        className: "w-[400px]",
        message: "삭제할 항목을 선택해주세요",
        confirmText: "확인",
      });
      return;
    }

    openAlert({
      className: "w-[400px]",
      message: `${selectedRows.length}건을 삭제하시겠습니까?`,
      confirmText: "확인",
      cancelText: "취소",
      onConfirm: () => {
        let seqList: string[] = [];
        let mutation: any = null;
        let param: any = null;

        switch (bottomTabActice) {
          case "PROGRESS":
            seqList = selectedRows.map((row) => row.progressSeq);
            mutation = multiDeleteProgressMutation;
            param = { tblSeq, progressSeqList: seqList };
            break;
          case "MEMO":
            seqList = selectedRows.map((row) => row.memoSeq);
            mutation = multiDeleteMemoMutation;
            param = { tblSeq, memoSeqList: seqList };
            break;
          case "GRACE_PERIOD":
            seqList = selectedRows.map((row) => row.gracePeriodSeq);
            mutation = multiDeleteGracePeriodMutation;
            param = { appSeq: tblSeq, gracePeriodSeqList: seqList };
            break;
          case "COST":
            seqList = selectedRows.map((row) => row.costSeq);
            mutation = multiDeleteCostMutation;
            param = { tblSeq, costSeqList: seqList };
            break;
          case "PREFERENCE":
            seqList = selectedRows.map((row) => row.preferenceSeq);
            mutation = multiDeletePreferenceMutation;
            param = { appSeq: tblSeq, preferenceSeqList: seqList };
            break;
          case "RND":
            seqList = selectedRows.map((row) => row.rndSeq);
            mutation = multiDeleteRndMutation;
            param = { appSeq: tblSeq, rndSeqList: seqList };
            break;
          case "FILE_LIST":
            seqList = selectedRows.map((row) => row.fileMappSeq);
            mutation = multiDeleteFileListMutation;
            param = { tblSeq, fileMappSeqList: seqList };
            break;
          case "RENEWAL":
            seqList = selectedRows.map((row) => row.costSeq);
            mutation = multiDeleteRenewalMutation;
            param = { appSeq: tblSeq, costSeqList: seqList };
            break;
          case "PRODUCT":
            seqList = selectedRows.map((row) => row.productGroupId); // ProductController uses productGroupId
            mutation = multiDeleteProductMutation;
            param = { appSeq: tblSeq, productSeqList: seqList };
            break;
          case "LOCAR":
            seqList = selectedRows.map((row) => row.locarnoGroupId);
            mutation = multiDeleteLocarnoMutation;
            param = { appSeq: tblSeq, locarnoSeqList: seqList };
            break;
          case "IDS":
            seqList = selectedRows.map((row) => row.idsSeq);
            mutation = multiDeleteIdsMutation;
            param = { appSeq: tblSeq, idsSeqList: seqList };
            break;
          case "REQUIRED_DOCS":
            seqList = selectedRows.map((row) => row.requiredDocSeq);
            mutation = multiDeleteRequiredDocMutation;
            param = { appSeq: tblSeq, requiredDocSeqList: seqList };
            break;
          case "MAINTENANCE_FEE":
            seqList = selectedRows.map((row) => row.maintenanceFeeSeq);
            mutation = multiDeleteMaintenanceFeeMutation;
            param = { appSeq: tblSeq, maintenanceFeeSeqList: seqList };
            break;
          case "WORK_MANAGE":
            seqList = selectedRows.map((row) => row.progressSeq);
            mutation = multiDeleteProgressMutation;
            param = { tblSeq, progressSeqList: seqList };
            break;
          case "CLAIM":
            seqList = selectedRows.map((row) => row.invoiceSeq);
            mutation = deleteIncidentClaimsMutation;
            param = seqList;
            break;
        }

        if (mutation) {
          mutation.mutate(param, {
            onSuccess: () => {
              setIsRefresh(!isRefresh);
              setSelectedRows([]); // 삭제 후 선택 초기화
              openAlert({
                className: "w-[400px]",
                message: "삭제가 완료되었습니다.",
                confirmText: "확인",
              });
            },
          });
        }
      },
    });
  };

  const onOpenChange = (isOpen: boolean) => {
    switch (bottomTabActice) {
      case "PROGRESS":
        setIsProgressOpenModal(isOpen);
        break;
      case "COST":
        setIsCostOpenModal(isOpen);
        break;
      case "GRACE_PERIOD":
        setIsGracePeriodOpenModal(isOpen);
        break;
      case "PREFERENCE":
        setIsPreferenceOpenModal(isOpen);
        break;
      case "MEMO":
        setIsMemoOpenModal(isOpen);
        break;
      case "RND":
        setIsRndOpenModal(isOpen);
        break;
      case "FILE_LIST":
        setIsFileListOpenModal(isOpen);
        break;
      case "RENEWAL":
        setIsRenewalOpenModal(isOpen);
        break;
      case "PRODUCT":
        setIsProductOpenModal(isOpen);
        break;
      case "LOCAR":
        setIsLocarOpenModal(isOpen);
        break;
      case "OVERSEAS":
        setIsOverseasOpenModal(isOpen);
        break;
      case "IDS":
        setIsIdsOpenModal(isOpen);
        break;
      case "REQUIRED_DOCS":
        setIsRequiredDocsOpenModal(isOpen);
        break;
      case "MAINTENANCE_FEE":
        setIsMainTenanceOpenModal(isOpen);
        break;
    }
  };

  const onSuccess = (rtnData: any) => {
    switch (rtnData.callbackData) {
      case "PROGRESS":
        setIsProgressOpenModal(false);
        break;
      case "COST":
        setIsCostOpenModal(false);
        break;
      case "GRACE_PERIOD":
        setIsGracePeriodOpenModal(false);
        break;
      case "PREFERENCE":
        setIsPreferenceOpenModal(false);
        break;
      case "MEMO":
        setIsMemoOpenModal(false);
        break;
      case "RND":
        setIsRndOpenModal(false);
        break;
      case "FILE_LIST":
        setIsFileListOpenModal(false);
        break;
      case "RENEWAL":
        setIsRenewalOpenModal(false);
        break;
      case "PRODUCT":
        setIsProductOpenModal(false);
        break;
      case "LOCAR":
        setIsLocarOpenModal(false);
        break;
      case "IDS":
        setIsIdsOpenModal(false);
        break;
      case "CLAIM":
        setIsClaimOpenModal(false);
        break;
      case "WORK_MANAGE":
        setIsWorkManageOpenModal(false);
        break;
      case "REQUIRED_DOCS":
        setIsRequiredDocsOpenModal(false);
        break;
      case "MAINTENANCE_FEE":
        setIsMainTenanceOpenModal(false);
        break;
      case "OVERSEAS":
        setIsOverseasOpenModal(false);
        break;
    }
    setIsRefresh(!isRefresh);
  };

  useEffect(() => {
    let targetValues: string[] = [];

    if (type === "basic") {
      targetValues = ["OVERSEAS", "PRODUCT", "GRACE_PERIOD", "PREFERENCE", "FILE_LIST", "MEMO"];
      setBottomTabActice("OVERSEAS");
    } else if (type === "domestic") {
      switch (rightType) {
        case RIGHT_TYPE.PATENT.code:
          targetValues = [
            "PROGRESS",
            "COST",
            "GRACE_PERIOD",
            "RND",
            "PREFERENCE",
            "HARD_SUMMARY",
            "FILE_LIST",
            "MEMO",
            "CLAIM",
            "WORK_MANAGE",
          ];
          break;
        case RIGHT_TYPE.PRACTICE.code:
          targetValues = [
            "PROGRESS",
            "COST",
            "GRACE_PERIOD",
            "RND",
            "PREFERENCE",
            "HARD_SUMMARY",
            "FILE_LIST",
            "MEMO",
            "CLAIM",
            "WORK_MANAGE",
          ];
          break;
        case RIGHT_TYPE.DESIGN.code:
          targetValues = [
            "PROGRESS",
            "COST",
            "LOCAR",
            "GRACE_PERIOD",
            "RND",
            "PREFERENCE",
            "FILE_LIST",
            "MEMO",
            "CLAIM",
            "WORK_MANAGE",
          ];
          break;
        case RIGHT_TYPE.TRADE.code:
          targetValues = [
            "PROGRESS",
            "RENEWAL",
            "PRODUCT",
            "PREFERENCE",
            "FILE_LIST",
            "MEMO",
            "CLAIM",
            "WORK_MANAGE",
          ];
          break;
        default:
          break;
      }
      setBottomTabActice("PROGRESS");
    } else if (type === "overseas") {
      // 출원 루트가 20 = 개국 일때 탭 지정.
      if (appRoute === "20") {
        switch (rightType) {
          case RIGHT_TYPE.PATENT.code:
            targetValues = [
              "PROGRESS",
              "REQUIRED_DOCS",
              "GRACE_PERIOD",
              "PREFERENCE",
              "MAINTENANCE_FEE",
              "COST",
              "HARD_SUMMARY",
              "FILE_LIST",
              "MEMO",
              "CLAIM",
              "WORK_MANAGE",
            ];
            break;
          case RIGHT_TYPE.PRACTICE.code:
            targetValues = [
              "PROGRESS",
              "REQUIRED_DOCS",
              "GRACE_PERIOD",
              "PREFERENCE",
              "MAINTENANCE_FEE",
              "COST",
              "HARD_SUMMARY",
              "FILE_LIST",
              "MEMO",
              "CLAIM",
              "WORK_MANAGE",
            ];
            break;
          case RIGHT_TYPE.DESIGN.code:
            targetValues = [
              "PROGRESS",
              "REQUIRED_DOCS",
              "GRACE_PERIOD",
              "PREFERENCE",
              "COST",
              "IDS",
              "SOFT_SUMMARY",
              "FILE_LIST",
              "MEMO",
              "CLAIM",
              "WORK_MANAGE",
            ];
            break;
          case RIGHT_TYPE.TRADE.code:
            targetValues = [
              "PROGRESS",
              "PRODUCT",
              "REQUIRED_DOCS",
              "GRACE_PERIOD",
              "PREFERENCE",
              "RENEWAL",
              "FILE_LIST",
              "MEMO",
              "CLAIM",
              "WORK_MANAGE",
            ];
            break;
          default:
            break;
        }
      } else if (appRoute === "30" || appRoute === "40") {
        // 출원 루트가 PCT 혹은 EP 일때.
        targetValues = [
          "PROGRESS",
          "REQUIRED_DOCS",
          "GRACE_PERIOD",
          "PREFERENCE",
          "HARD_SUMMARY",
          "FILE_LIST",
          "MEMO",
          "CLAIM",
          "WORK_MANAGE",
        ];
      } else if (appRoute === "50") {
        // 출원루트가 마드리드 일때.
        targetValues = [
          "PROGRESS",
          "PRODUCT",
          "GRACE_PERIOD",
          "PREFERENCE",
          "RENEWAL",
          "FILE_LIST",
          "MEMO",
          "CLAIM",
          "WORK_MANAGE",
        ];
      } else if (appRoute === "60") {
        // 출원루트가 국제디자인일때.
        targetValues = [
          "PROGRESS",
          "LOCAR",
          "GRACE_PERIOD",
          "PREFERENCE",
          "COST",
          "FILE_LIST",
          "MEMO",
          "CLAIM",
          "WORK_MANAGE",
        ];
      } else {
        targetValues = [
          "PROGRESS",
          "IDS",
          "REQUIRED_DOCS",
          "GRACE_PERIOD",
          "PREFERENCE",
          "COST",
          "HARD_SUMMARY",
          "FILE_LIST",
          "MEMO",
          "CLAIM",
          "WORK_MANAGE",
        ];
      }
      setBottomTabActice("PROGRESS");
    } else if (type === "objection-trial" || type === "etc-case") {
      targetValues = ["PROGRESS", "PRODUCT", "FILE_LIST", "MEMO", "CLAIM", "WORK_MANAGE"];
      setBottomTabActice("PROGRESS");
    } else {
      targetValues = ["CLAIM"];
      setBottomTabActice("CLAIM");
    }

    const filteredTabs = targetValues.reduce((acc, value) => {
      const tab = tabs.find((tab) => tab.value === value);
      if (tab) {
        // @ts-ignore
        acc.push(tab);
      }
      return acc;
    }, []);
    setTab(filteredTabs);
  }, [type, rightType]);

  const onTableRowClick = (tab: string, rowData: any) => {
    setBottomTabActice(tab);
    setMemoRowData(rowData);
    switch (tab) {
      case "MEMO":
        setIsMemoOpenModal(true); // 모달 오픈
        break;
      case "PROGRESS":
        setIsProgressOpenModal(true); // 모달 오픈
        break;
      case "FILE_LIST":
        setIsFileListOpenModal(true); // 모달 오픈
        break;
      case "MAINTENANCE_FEE":
        setIsMainTenanceOpenModal(true); // 모달 오픈
        break;
      case "PREFERENCE":
        setIsPreferenceOpenModal(true); // 모달 오픈
        break;
      case "RND":
        setIsRndOpenModal(true); // 모달 오픈
        break;
      case "COST":
        setIsCostOpenModal(true); // 모달 오픈
        break;
      case "REQUIRED_DOCS":
        setIsRequiredDocsOpenModal(true); // 모달 오픈
        break;
      case "IDS":
        setIsIdsOpenModal(true); // 모달 오픈
        break;
      case "GRACE_PERIOD":
        setIsGracePeriodOpenModal(true); // 모달 오픈
        break;
      case "PRODUCT":
        setIsProductOpenModal(true); // 모달 오픈
        break;
      case "LOCAR":
        setIsLocarOpenModal(true); // 모달 오픈
        break;
      case "RENEWAL":
        setIsRenewalOpenModal(true); // 모달 오픈
        break;
      case "CLAIM":
        // inOutType에 따라 billTypeGb 설정 (INV: 국내, INV_INC/INV_OUT: 해외)
        if (rowData.inOutType === "INV") {
          setBillTypeGb("DOMESTICBILL");
        } else {
          setBillTypeGb("OVERSEASBILL");
        }
        setIsClaimOpenModal(true); // 모달 오픈
        break;
      case "OVERSEAS":
        // appRoute.code에 따라 typeGb 설정
        // 20: 개국, 30: PCT, 40: EP, 50: 마드리드, 60: 국제디자인
        if (rowData.appRoute?.code === "20") setTypeGb("DIRECT");
        else if (rowData.appRoute?.code === "30") setTypeGb("PCT");
        else if (rowData.appRoute?.code === "40") setTypeGb("EP");
        else if (rowData.appRoute?.code === "50") setTypeGb("MADRID");
        else if (rowData.appRoute?.code === "60") setTypeGb("NATIONAL");
        
        setIsOverseasOpenModal(true); // 모달 오픈
        break;
    }
  };

  // 선택된 rows 수신
  const onSelectedRowsChange = (tab: string, rows: any[]) => {
    setSelectedRows(rows);
  };

  return (
    <>
      <BoxTab items={tab} active={bottomTabActice} className="mt-4" onClick={tabClick} />
      <FlexBox className="justtify-between py-3">
        <FlexBox className="text-text-200 items-center text-sm">
          *안내 멘트나 유의사항이 들어갈수도 있다
        </FlexBox>
        <FlexBox className="flex-0 space-x-2">
          {bottomTabActice === "OVERSEAS" && (
            <RHF.FormSelect
              control={form.control}
              name="typeGb"
              items={[
                {
                  value: "DIRECT",
                  label: "개국",
                },
                {
                  value: "EP",
                  label: "EP",
                },
                {
                  value: "PCT",
                  label: "PCT",
                },
                {
                  value: "MADRID",
                  label: "마드리드",
                },
                {
                  value: "NATIONAL",
                  label: "국제디자인",
                },
              ]}
              className="w-50"
            />
          )}

          {bottomTabActice === "CLAIM" && (
            <RHF.FormSelect
              control={form.control}
              name="billTypeGb"
              items={[
                {
                  value: "DOMESTICBILL",
                  label: "내국청구서",
                },
                {
                  value: "FOREIGNBILL",
                  label: "해외청구서",
                },
                {
                  value: "OVERSEASBILL",
                  label: "외국청구서",
                },
              ]}
              className="w-50"
            />
          )}

          {bottomTabActice !== "HARD_SUMMARY" && (
            <>
              <Button variant="blue" size="h28" onClick={addReg}>
                <Icons.Plus />
                신규등록
              </Button>
              {bottomTabActice !== "OVERSEAS" && (
                <Button
                  variant="red"
                  size="h28"
                  onClick={del}
                  disabled={selectedRows.length === 0}
                >
                  <Icons.Trash2 />
                  삭제
                </Button>
              )}
            </>
          )}
        </FlexBox>
      </FlexBox>
      <CustomBottomTabelRender
        activeTab={bottomTabActice}
        tblSeq={tblSeq}
        isRefresh={isRefresh}
        height={300}
        onRowClick={onTableRowClick}
        onSelectedRowsChange={onSelectedRowsChange}
        type={type}
      />

      {isProgressOpenModal && (
        <ProgressModal
          open={isProgressOpenModal}
          onOpenChange={onOpenChange}
          onSuccess={onSuccess}
          rowData={memoRowData}
          propData={tblSeq}
        />
      )}
      {isIdsOpenModal && (
        <IdsModal
          open={isIdsOpenModal}
          onOpenChange={onOpenChange}
          onSuccess={onSuccess}
          rowData={memoRowData}
          propData={tblSeq}
        />
      )}

      {isWorkManageOpenModal && (
        <ProgressModal
          open={isWorkManageOpenModal}
          onOpenChange={onOpenChange}
          onSuccess={onSuccess}
          propData={tblSeq}
          callbackData="WORK_MANAGE"
        />
      )}
      {isRequiredDocsOpenModal && (
        <RequiredDocsModal
          open={isRequiredDocsOpenModal}
          onOpenChange={onOpenChange}
          onSuccess={onSuccess}
          propData={tblSeq}
          rowData={memoRowData}
        />
      )}
      {isMainTenanceOpenModal && (
        <MaintenanceModal
          open={isMainTenanceOpenModal}
          onOpenChange={onOpenChange}
          onSuccess={onSuccess}
          propData={tblSeq}
          rowData={memoRowData}
        />
      )}
      {isCostOpenModal && (
        <CostModal
          open={isCostOpenModal}
          onOpenChange={onOpenChange}
          onSuccess={onSuccess}
          propData={tblSeq}
          rowData={memoRowData}
          title="납부내역"
        />
      )}

      {isGracePeriodOpenModal && (
        <GracePeriodModal
          open={isGracePeriodOpenModal}
          onOpenChange={onOpenChange}
          onSuccess={onSuccess}
          propData={tblSeq}
          rowData={memoRowData}
          title="공지예외 등록"
        />
      )}

      {isPreferenceOpenModal && (
        <PreferenceModal
          open={isPreferenceOpenModal}
          onOpenChange={onOpenChange}
          onSuccess={onSuccess}
          propData={tblSeq}
          rowData={memoRowData}
          title="우선권내역"
        />
      )}

      {isMemoOpenModal && (
        <MemoModal
          open={isMemoOpenModal}
          onOpenChange={onOpenChange}
          onSuccess={onSuccess}
          propData={tblSeq}
          rowData={memoRowData}
        />
      )}
      {isRndOpenModal && (
        <RndModal
          open={isRndOpenModal}
          onOpenChange={onOpenChange}
          onSuccess={onSuccess}
          propData={tblSeq}
          rowData={memoRowData}
          title="연구과제등록"
        />
      )}
      {isFileListOpenModal && (
        <FileListModal
          open={isFileListOpenModal}
          onOpenChange={onOpenChange}
          onSuccess={onSuccess}
          propData={tblSeq}
          rowData={memoRowData}
          title="전자포대등록"
        />
      )}

      {isRenewalOpenModal && (
        <RenewalModal
          open={isRenewalOpenModal}
          onOpenChange={onOpenChange}
          onSuccess={onSuccess}
          propData={tblSeq}
          rowData={memoRowData}
          title="갱신관리"
        />
      )}

      {isProductOpenModal && (
        <NewProductModal
          open={isProductOpenModal}
          onOpenChange={onOpenChange}
          onSuccess={onSuccess}
          propData={tblSeq}
          rowData={memoRowData}
          title="지정상품등록"
        />
      )}
      {isOverseasOpenModal && (
        <WrapperModal isOpen={isOverseasOpenModal} onClose={() => setIsOverseasOpenModal(false)}>
          {typeGb === "DIRECT" && <DirectAppForm tblSeq={tblSeq} appSeq={memoRowData?.appSeq} onSuccess={() => onSuccess({ callbackData: "OVERSEAS" })} />}
          {typeGb === "EP" && <EpForm tblSeq={tblSeq} appSeq={memoRowData?.appSeq} onSuccess={() => onSuccess({ callbackData: "OVERSEAS" })} />}
          {typeGb === "PCT" && <PctForm tblSeq={tblSeq} appSeq={memoRowData?.appSeq} onSuccess={() => onSuccess({ callbackData: "OVERSEAS" })} />}
          {typeGb === "NATIONAL" && <NationalForm tblSeq={tblSeq} appSeq={memoRowData?.appSeq} onSuccess={() => onSuccess({ callbackData: "OVERSEAS" })} />}
          {typeGb === "MADRID" && <MadridForm tblSeq={tblSeq} appSeq={memoRowData?.appSeq} onSuccess={() => onSuccess({ callbackData: "OVERSEAS" })} />}
        </WrapperModal>
      )}
      {isClaimOpenModal && (
        <WrapperModal isOpen={isClaimOpenModal} onClose={() => setIsClaimOpenModal(false)}>
          {billTypeGb === "DOMESTICBILL" && (
            <DomesticBillForm
              appSeq={tblSeq}
              billSeq={memoRowData?.invoiceSeq}
              onSuccess={() => onSuccess({ callbackData: "CLAIM" })}
            />
          )}
          {billTypeGb === "FOREIGNBILL" && (
            <ForeignBillForm
              appSeq={tblSeq}
              billSeq={memoRowData?.invoiceSeq}
              onSuccess={() => onSuccess({ callbackData: "CLAIM" })}
            />
          )}
          {billTypeGb === "OVERSEASBILL" && (
            <OverseasBillForm
              appSeq={tblSeq}
              billSeq={memoRowData?.invoiceSeq}
              onSuccess={() => onSuccess({ callbackData: "CLAIM" })}
            />
          )}
        </WrapperModal>
      )}
      {isLocarOpenModal && (
        <LocarModal
          open={isLocarOpenModal}
          onOpenChange={onOpenChange}
          onSuccess={onSuccess}
          propData={tblSeq}
          rowData={memoRowData}
          title="로카르노"
        />
      )}
    </>
  );
};;

export default CustomBottom;
