import type { ColumnDef } from "@tanstack/react-table";
import { formatDate, formatAppNo, formatRegNo } from "@shared/util/formatUtil";
import { selectColumn } from "@shared/util/selectColumn";

// export type DomesticListColType = {
//   appSeq: string;
//   category: {
//     code: string;
//     codeName: string;
//   };
//   rightType: {
//     code: string;
//     codeName: string;
//   };
//   caseDeadline: string;
//   status: {
//     code: string;
//     codeName: string;
//   };
//   receiptDate: string;
//   ourRef: string;
//   yourRef: string;
//   clientRef: string;
//   clientName: string;
//   applicantName: string;
//   appDate: string;
//   appNo: string;
// };

type CodeName = {
  code: string;
  codeName: string;
};

type UserInfo = {
  userSeq: string;
  userName: string;
};

type YesNo = "Y" | "N";

export type DomesticListColType = {
  rowNum: number;
  appSeq: string;
  officeSeq: string;

  category: CodeName;
  rightType: CodeName;
  status: CodeName;

  caseDeadline: string;
  receiptDate: string;
  ourRef: string;
  yourRef: string;
  clientRef: string;
  accessCode: string;
  deptName: string;

  clientName: string;
  applicantName: string;
  inventorInfo: UserInfo;
  regMgrInfo: UserInfo;
  clientContactInfo: UserInfo;
  adminMgrInfo: UserInfo;
  caseMgrInfo: UserInfo;
  attorneyInfo: UserInfo;

  appDate: string;
  appNo: string;
  regDate: string;
  regNo: string;
  titleKo: string;
  titleEn: string;
  proposal: string;
  note: string;
  goodsClass: string | null;

  draftSendDate: string;
  reqDeadline: string;
  appDeadline: string;
  appOrderDate: string;
  examRequestDate: string;
  foreignAppDate: string;
  annuityOrderDate: string;
  annuityAgency: string;
  abandonDate: string;
  abandonNote: string;

  appType: CodeName;
  appCategory: CodeName;
  grade: CodeName;

  independentClaims: string;
  dependentClaims: string;
  finalClaimsCount: string;
  specPage: string;
  drawingCount: string;
  figureCount: string;

  classificAppNo: string | null;
  firstAppDate: string;
  firstAppNo: string;
  originalAppDate: string;
  originalAppNo: string;
  reAppDate: string;
  reAppNo: string;
  dualAppDate: string;
  dualAppNo: string;
  globalAppDate: string;
  globalAppNo: string;
  priorityDate: string;

  isTrademarkResearch: string | null;
  isForeignApp: YesNo;
  foreignAppTiming: CodeName;
  foreign6mDeadline: string;
  foreign1yDeadline: string;

  claimsNoticeDate: string;
  claimsDeadline: string;
  claimsSubmitDate: string;
  priorExamReqDate: string;
  priorExamDecDate: string;
  earlyPubRequestDate: string;
  pubDate: string;
  pubNo: string;

  announcementDecisionDate: string;
  announcementDate: string;
  announcementNo: string;
  regDecisionDate: string;
  regReceiptDate: string;
  regNormalDeadline: string;
  regGraceDeadline: string;
  originalRegDate: string;
  originalRegNo: string | null;
  regAnnounceDate: string;
  regAnnounceNo: string;

  madridAppDate: string;
  madridAppNo: string | null;
  ipcClassification: string;
  rightPeriod: string;

  isAnnuityManaged: YesNo;
  penaltyDeadline: string;
  annuityYear: string | null;

  standardDeadline: string;
  isRenewalManaged: string | null;
  renewalDeadline: string;
  trademarkRenewalFee: string | null;

  hasDomesticPriority: YesNo;
  domesticPriorDeadline: string;
  domesticPriorDate: string;

  createUser: string;
  createAt: string;
  updateUser: string;
  updateAt: string;
};

export const domesticListColumnsData: ColumnDef<DomesticListColType, any>[] = [
//   selectColumn<DomesticListColType>(50),

  {
    id: "category.codeName",
    accessorFn: (row) => row.category?.codeName,
    header: "구분",
    size: 70,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    id: "rightType.codeName",
    accessorFn: (row) => row.rightType?.codeName,
    header: "권리",
    size: 100,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },

  {
    accessorKey: "caseDeadline",
    header: "사건마감일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    id: "status.codeName",
    accessorFn: (row) => row.status?.codeName,
    header: "현재상태",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
    meta: { pin: "left" },
  },
  {
    accessorKey: "receiptDate",
    header: "접수일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "ourRef",
    header: "OurRef",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "yourRef",
    header: "yourRef",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "clientRef",
    header: "출원인관리번호",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "clientNm",
    header: "의뢰인",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },

  {
    accessorKey: "applicantNm",
    header: "출원인",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "appDate",
    header: "출원일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "appNo",
    header: "출원번호",
    size: 130,
    cell: (info: any) => <div>{formatAppNo(info.getValue())}</div>,
  },
  {
    accessorKey: "regDate",
    header: "등록일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "regNo",
    header: "등록번호",
    size: 130,
    cell: (info: any) => <div>{formatRegNo(info.getValue())}</div>,
  },
  {
    accessorKey: "accessCode",
    header: "접근코드",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "proposal",
    header: "제안명칭",
    size: 400,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
    meta: {
      cellAlign: "left",
    },
  },
  {
    accessorKey: "titleKo",
    header: "국문명칭",
    size: 400,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
    meta: {
      cellAlign: "left",
    },
  },
  {
    accessorKey: "titleEn",
    header: "영문명칭",
    size: 400,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
    meta: {
      cellAlign: "left",
    },
  },

  {
    accessorKey: "note",
    header: "비고",
    size: 400,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
    meta: {
      cellAlign: "left",
    },
  },
  {
    accessorKey: "goodsClass",
    header: "류(Class)",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    id: "inventorInfo.userName",
    accessorFn: (row) => row.inventorInfo?.userName,
    header: "발명자",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    id: "regMgrNm",
    accessorFn: (row: any) => row.regMgrNm ?? row.regMgrInfo?.userName ?? "",
    header: "등록권리자",
    size: 130,
    cell: (info: any) => {
      return <div className="capitalize">{info.getValue()}</div>;
    },
  },
  {
    id: "clientContactInfo.userName",
    accessorFn: (row) => row.clientContactInfo?.userName,
    header: "출원인담당자",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    id: "adminMgrInfo.userName",
    accessorFn: (row) => row.adminMgrInfo?.userName,
    header: "관리담당자",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    id: "caseMgrInfo.userName",
    accessorFn: (row) => row.caseMgrInfo?.userName,
    header: "사건담당자",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    id: "attorneyInfo.userName",
    accessorFn: (row) => row.attorneyInfo?.userName,
    header: "담당변리사",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "draftSendDate",
    header: "초안발송일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "reqDeadline",
    header: "신청마감일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "examRequestDate",
    header: "심사청구일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "foreignAppDate",
    header: "해외출원일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "standardDeadline",
    header: "연차마감일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "renewalDeadline",
    header: "갱신마감일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "annuityOrderDate",
    header: "위임일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "annuityAgency",
    header: "위임업체",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "abandonDate",
    header: "포기취하일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "abandonNote",
    header: "포기내용",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    id: "appType.codeName",
    accessorFn: (row) => row.appType?.codeName,
    header: "출원종류",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    id: "appCategory.codeName",
    accessorFn: (row) => row.appCategory?.codeName,
    header: "출원구분",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "appOrderDate",
    header: "출원지시일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "appDeadline",
    header: "출원마감일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },

  {
    id: "grade.codeName",
    accessorFn: (row) => row.grade?.codeName,
    header: "등급",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "independentClaims",
    header: "독립항",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "dependentClaims",
    header: "종속항",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "specPage",
    header: "명세서",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "drawingCount",
    header: "도면수",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "figureCount",
    header: "도수",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "finalClaimsCount",
    header: "최종항수",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "classificAppNo",
    header: "분류출원번호",
    size: 130,
    cell: (info: any) => <div>{formatAppNo(info.getValue())}</div>,
  },
  {
    accessorKey: "firstAppDate",
    header: "최초출원일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "firstAppNo",
    header: "최초출원번호",
    size: 130,
    cell: (info: any) => <div>{formatAppNo(info.getValue())}</div>,
  },
  {
    accessorKey: "originalAppDate",
    header: "원출원일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "originalAppNo",
    header: "원출원번호",
    size: 130,
    cell: (info: any) => <div>{formatAppNo(info.getValue())}</div>,
  },
  {
    accessorKey: "reAppDate",
    header: "재출원일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "reAppNo",
    header: "재출원번호",
    size: 130,
    cell: (info: any) => <div>{formatAppNo(info.getValue())}</div>,
  },
  {
    accessorKey: "dualAppDate",
    header: "이중출원일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "dualAppNo",
    header: "이중출원번호",
    size: 130,
    cell: (info: any) => <div>{formatAppNo(info.getValue())}</div>,
  },
  {
    accessorKey: "globalAppDate",
    header: "국제출원일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "globalAppNo",
    header: "국제출원번호",
    size: 130,
    cell: (info: any) => <div>{formatAppNo(info.getValue())}</div>,
  },
  {
    accessorKey: "priorityDate",
    header: "최초우선권주장일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "isTrademarkResearch",
    header: "상표조사여부",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "isForeignApp",
    header: "해외진행여부",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    id: "foreignAppTiming.codeName",
    accessorFn: (row) => row.foreignAppTiming?.codeName,
    header: "해외진행방법",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "foreign6mDeadline",
    header: "해외출원마감일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "foreign1yDeadline",
    header: "해외출원마감일2",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "claimsNoticeDate",
    header: "청구범위통지일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "claimsDeadline",
    header: "청구범위마감일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "claimsSubmitDate",
    header: "청구범위제출일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "priorExamReqDate",
    header: "우심사청구일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "priorExamDecDate",
    header: "우심사결정일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "earlyPubRequestDate",
    header: "공개신청일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "pubDate",
    header: "공개일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "pubNo",
    header: "공개번호",
    size: 130,
    cell: (info: any) => <div>{formatAppNo(info.getValue())}</div>,
  },
  {
    accessorKey: "announcementDecisionDate",
    header: "공고결정일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue("announcementDecisionDate")) || "-"}</div>,
  },
  {
    accessorKey: "announcementDate",
    header: "공고일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "announcementNo",
    header: "공고번호",
    size: 130,
    cell: (info: any) => <div>{formatAppNo(info.getValue())}</div>,
  },
  {
    accessorKey: "regDecisionDate",
    header: "등록결정일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "regReceiptDate",
    header: "등록접수일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "regNormalDeadline",
    header: "등록마감일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "regGraceDeadline",
    header: "등록과태마감일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "originalRegDate",
    header: "원등록일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "originalRegNo",
    header: "원등록번호",
    size: 130,
    cell: (info: any) => <div>{formatRegNo(info.getValue())}</div>,
  },
  {
    accessorKey: "regAnnounceDate",
    header: "등록공고일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "regAnnounceNo",
    header: "등록공고번호",
    size: 130,
    cell: (info: any) => <div>{formatRegNo(info.getValue())}</div>,
  },
  {
    accessorKey: "madridAppDate",
    header: "국제등록일MD",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "madridAppNo",
    header: "국제등록번호MD",
    size: 130,
    cell: (info: any) => <div>{formatRegNo(info.getValue())}</div>,
  },
  {
    accessorKey: "ipcClassification",
    header: "IPC분류",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "rightPeriod",
    header: "권리존속기간",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "isAnnuityManaged",
    header: "연차관리여부",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "penaltyDeadline",
    header: "연차과태일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "annuityYear",
    header: "납부차수",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "appNo1",
    header: "연차료(X)",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "isRenewalManaged",
    header: "갱신관리여부",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "appNo2",
    header: "갱신과태마감일(X)",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "trademarkRenewalFee",
    header: "갱신등록료",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "deptName",
    header: "부서",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "hasDomesticPriority",
    header: "국내우선권주장여부",
    size: 130,
    cell: (info: any) => <div className="capitalize">{info.getValue()}</div>,
  },
  {
    accessorKey: "domesticPriorDeadline",
    header: "국내우선권주장마감일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  {
    accessorKey: "domesticPriorDate",
    header: "국내우선권주장일",
    size: 130,
    cell: (info: any) => <div>{formatDate(info.getValue())}</div>,
  },
  // {
  //     "accessorKey": "appNo",
  //     "header": "NO",
  //     "size": 130,
  //     "cell": (info: any) => <div className="capitalize">{info.getValue("appNo")}</div>
  // }
];
