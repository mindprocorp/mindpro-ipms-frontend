import type { RouteObject } from "react-router-dom";

// ── 공개 라우트 ──
import Login from "@pages/auth/login/Login.tsx";
import Join from "@pages/auth/join/Join.tsx";
import JoinComplete from "@pages/auth/join/Complete.tsx";
import IdFind from "@pages/auth/id-find/IdFind.tsx";
import PwFind from "@pages/auth/pw-find/PwFind.tsx";
import Modify from "@pages/auth/join/Modify.tsx";
import ResetPassword from "@pages/auth/reset-password/ResetPassword.tsx";
import SocialCallback from "@pages/auth/social-callback/SocialCallback.tsx";
import SocialVerify from "@pages/auth/social-verify/SocialVerify.tsx";

// ── 인증 필요 라우트 ──
import Dashboard from "@pages/dashboard/Dashboard.tsx";
import MyWork from "@pages/my-work/MyWork.tsx";

// 국내/해외 출원
import DomesticList from "@pages/domestic/list/DomesticList.tsx";
import DomesticForm from "@pages/domestic/detail/DomesticForm.tsx";
import OverseasBasicList from "@pages/overseas/basic/list/OverseasBasicList.tsx";
import BasicForm from "@pages/overseas/basic/BasicForm.tsx";
import OverseasEtcList from "@pages/overseas/etc/list/OverseasEtcList.tsx";
import DirectAppForm from "@pages/overseas/etc/direct-app/DirectAppForm.tsx";
import EpForm from "@pages/overseas/etc/ep/EpForm.tsx";
import PctForm from "@pages/overseas/etc/pct/PctForm.tsx";
import MadridForm from "@pages/overseas/etc/madrid/MadridForm.tsx";
import NationalForm from "@pages/overseas/etc/national/NationalForm.tsx";

// 이의/심판, 기타 사건
import ObjectionTrialList from "@pages/objection-trial/list/ObjectionTrialList.tsx";
import ObjectionTrialForm from "@pages/objection-trial/detail/ObjectionTrialForm.tsx";
import EtcCaseList from "@pages/etc-case/list/EtcCaseList.tsx";
import EtcCaseForm from "@pages/etc-case/detail/EtcCaseForm.tsx";

// 고객 관리
import CustomerMngList from "@pages/customer-mng/list/CustomerMngList.tsx";
import CustomerMngForm from "@pages/customer-mng/detail/CustomerMngForm.tsx";
import CustomerManagerList from "@pages/customer-mng/manager/list/CustomerManagerList.tsx";

// 청구 관리
import DomesticBillList from "@pages/bill/domestic/list/DomesticBillList.tsx";
import DomesticBillForm from "@pages/bill/domestic/DomesticBillForm.tsx";
import OverseasBillList from "@pages/bill/overseas/list/OverseasBillList.tsx";
import OverseasBillForm from "@pages/bill/overseas/OverseasBillForm.tsx";
import ForeignBillList from "@pages/bill/foreign/list/ForeignBillList.tsx";
import ForeignBillForm from "@pages/bill/foreign/ForeignBillForm.tsx";

// 기타
import SendReceiveList from "@pages/send-receive/list/SendReceiveList.tsx";
import DocumentDispatchList from "@pages/document-dispatch/list/DocumentDispatchList.tsx";
import EFileManageList from "@pages/e-file-manage/list/EFileManageList.tsx";
import HistorySearchList from "@pages/history/list/HistorySearchList.tsx";
import DeadLineMng from "@pages/dead-line/DeadLineMng";
import Publishing from "@pages/pub";

// ── 게시판 ──
import BoardLayout from "@pages/board/layout/BoardLayout.tsx";
import BoardMainPage from "@pages/board/main/BoardMainPage.tsx";
import BoardList from "@pages/board/list/BoardList.tsx";
import BoardForm from "@pages/board/detail/BoardForm.tsx";
import BoardView from "@pages/board/detail/BoardView.tsx";


// ── 결재 ──
import DraftList from "@pages/approval/draft/DraftList.tsx";
import DraftWrite from "@pages/approval/draft/DraftWrite.tsx";
import PendingList from "@pages/approval/pending/PendingList.tsx";
import ReferenceList from "@pages/approval/reference/ReferenceList.tsx";
import InboxList from "@pages/approval/inbox/InboxList.tsx";
import DeptInboxList from "@pages/approval/dept-inbox/DeptInboxList.tsx";
import DeptReferenceList from "@pages/approval/dept-reference/DeptReferenceList.tsx";
import SignatureManage from "@pages/approval/signature/SignatureManage.tsx";

// ── 환경설정 ──
import DeptTreeList from "@pages/settings/org/DeptTreeList.tsx";
import OrgStructureList from "@pages/settings/org/OrgStructureList.tsx";
import EmployeeList from "@pages/settings/member/list/EmployeeList.tsx";
import FormCategoryList from "@pages/settings/form/list/FormCategoryList.tsx";
import FormTemplateList from "@pages/settings/form/list/FormTemplateList.tsx";
import ApprTypeList from "@pages/settings/approval/list/ApprTypeList.tsx";
import ApprTemplateList from "@pages/settings/approval/list/ApprTemplateList.tsx";
import CommonCodeList from "@pages/settings/system/list/CommonCodeList.tsx";
import MenuMngList from "@pages/settings/system/list/MenuMngList.tsx";
import RoleMngList from "@pages/settings/system/list/RoleMngList.tsx";
import PlanMngList from "@pages/settings/system/list/PlanMngList.tsx";
import BoardMngList from "@pages/settings/board/BoardMngList.tsx";

// 공개 라우트 (인증 불필요)
export const publicRoutes: RouteObject[] = [
  { path: "/", element: <Login /> },
  { path: "/join", element: <Join /> },
  { path: "/complete", element: <JoinComplete /> },
  { path: "/idFind", element: <IdFind /> },
  { path: "/pwFind", element: <PwFind /> },
  { path: "/memModify", element: <Modify /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/auth/:provider/callback", element: <SocialCallback /> },
  { path: "/social-verify", element: <SocialVerify /> },
];

// 인증 필요 라우트 (사이드바 표시 여부는 ConditionalSidebar가 DB sidebarYn 기준으로 판단)
export const authRoutes: RouteObject[] = [
  // 대시보드 / 내 업무
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/my-work", element: <MyWork /> },

  // 국내 출원
  { path: "/domestic/list", element: <DomesticList /> },
  { path: "/domestic/write", element: <DomesticForm /> },
  { path: "/domestic/detail/:domesticSeq", element: <DomesticForm /> },
  { path: "/domesticNew/detail/:domesticSeq", element: <DomesticForm /> },

  // 해외 출원
  { path: "/overseas/basic/list", element: <OverseasBasicList /> },
  { path: "/overseas/basic/write", element: <BasicForm /> },
  { path: "/overseas/basic/detail/:overseasSeq", element: <BasicForm /> },
  { path: "/overseas/etc/list", element: <OverseasEtcList /> },
  { path: "/overseas/direct/write/:overseasSeq", element: <DirectAppForm /> },
  { path: "/overseas/direct/detail/:overseasDirectSeq", element: <DirectAppForm /> },
  { path: "/overseas/ep/write/:basicSeq", element: <EpForm /> },
  { path: "/overseas/ep/detail/:appSeq", element: <EpForm /> },
  { path: "/overseas/pct/write/:basicSeq", element: <PctForm /> },
  { path: "/overseas/pct/detail/:appSeq", element: <PctForm /> },
  { path: "/overseas/madrid/write/:basicSeq", element: <MadridForm /> },
  { path: "/overseas/madrid/detail/:appSeq", element: <MadridForm /> },
  { path: "/overseas/national/write/:basicSeq", element: <NationalForm /> },
  { path: "/overseas/national/detail/:appSeq", element: <NationalForm /> },

  // 이의/심판, 기타 사건
  { path: "/objection-trial/list", element: <ObjectionTrialList /> },
  { path: "/objection-trial/write", element: <ObjectionTrialForm /> },
  { path: "/objection-trial/detail/:conflictSeq", element: <ObjectionTrialForm /> },
  { path: "/etc-case/list", element: <EtcCaseList /> },
  { path: "/etc-case/write", element: <EtcCaseForm /> },
  { path: "/etc-case/detail/:conflictSeq", element: <EtcCaseForm /> },

  // 고객 관리
  { path: "/customer-mng/list", element: <CustomerMngList /> },
  { path: "/customer-mng/write", element: <CustomerMngForm /> },
  { path: "/customer-mng/detail/:customerSeq", element: <CustomerMngForm /> },
  { path: "/customer-mng/manager/list", element: <CustomerManagerList /> },

  // 청구 관리
  { path: "/bill/domestic/list", element: <DomesticBillList /> },
  { path: "/bill/domestic/write", element: <DomesticBillForm /> },
  { path: "/bill/domestic/detail/:billSeq", element: <DomesticBillForm /> },
  { path: "/bill/overseas/list", element: <OverseasBillList /> },
  { path: "/bill/overseas/write", element: <OverseasBillForm /> },
  { path: "/bill/overseas/detail/:billSeq", element: <OverseasBillForm /> },
  { path: "/bill/foreign/list", element: <ForeignBillList /> },
  { path: "/bill/foreign/write", element: <ForeignBillForm /> },
  { path: "/bill/foreign/detail/:billSeq", element: <ForeignBillForm /> },
  { path: "/domesticBill", element: <DomesticBillForm /> },
  { path: "/overseasBill", element: <OverseasBillForm /> },
  { path: "/foreignBill", element: <ForeignBillForm /> },

  // 게시판 (BoardLayout이 사이드바 공통 제공)
  {
    element: <BoardLayout />,
    children: [
      { path: "/board", element: <BoardMainPage /> },
      { path: "/board/list", element: <BoardList /> },
      { path: "/board/write", element: <BoardForm /> },
      { path: "/board/view/:boardSeq", element: <BoardView /> },
      { path: "/board/detail/:boardSeq", element: <BoardForm /> },
    ],
  },

  // 기타
  { path: "/send-receive/list", element: <SendReceiveList /> },
  { path: "/document-dispatch/list", element: <DocumentDispatchList /> },
  { path: "/e-file-manage/list", element: <EFileManageList /> },
  { path: "/history/list", element: <HistorySearchList /> },
  { path: "/deadLine", element: <DeadLineMng /> },
  { path: "/pub", element: <Publishing /> },

  // 결재 (사이드바 레이아웃)
  { path: "/approval", element: <></> },
  { path: "/approval/draft/list", element: <DraftList /> },
  { path: "/approval/draft/write", element: <DraftWrite /> },
  { path: "/approval/pending", element: <PendingList /> },
  { path: "/approval/reference", element: <ReferenceList /> },
  { path: "/approval/inbox", element: <InboxList /> },
  { path: "/approval/dept-inbox", element: <DeptInboxList /> },
  { path: "/approval/dept-reference", element: <DeptReferenceList /> },
  { path: "/approval/signature", element: <SignatureManage /> },

  // 환경설정 (사이드바 레이아웃)
  { path: "/settings", element: <></> },
  { path: "/settings/org/chart", element: <DeptTreeList /> },
  { path: "/settings/org/structure", element: <OrgStructureList /> },
  { path: "/settings/member", element: <EmployeeList /> },
  { path: "/settings/form/category", element: <FormCategoryList /> },
  { path: "/settings/form/template", element: <FormTemplateList /> },
  { path: "/settings/approval/type", element: <ApprTypeList /> },
  { path: "/settings/approval/template", element: <ApprTemplateList /> },
  { path: "/settings/system/code", element: <CommonCodeList /> },
  { path: "/settings/system/menu", element: <MenuMngList /> },
  { path: "/settings/system/role", element: <RoleMngList /> },
  { path: "/settings/system/plan", element: <PlanMngList /> },

  // 게시판 설정 (관리자)
  { path: "/settings/system/board", element: <BoardMngList /> },
];
