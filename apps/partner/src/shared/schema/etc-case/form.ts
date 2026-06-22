import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type EtcCaseFormInput, EtcCaseSchema } from "@shared/schema/etc-case/etcCaseSchema.ts";

const emptyCode = { code: "", codeName: "" };
const emptyUser = { userSeq: "", userName: "" };

export const defaultValues: EtcCaseFormInput = {
  cftCaseMng: {
    appClassification: emptyCode,
    rightType:         emptyCode,
    caseType:          emptyCode,
    receiptDate: "",
    ourRef:    "",
    yourRef:   "",
    clientRef: "",
    appSeq:    "",
  },
  appBaseInfo: {
    countryCode: emptyCode,
    appDate:    "",
    appNo:      "",
    pubDate:    "",
    regDate:    "",
    regNo:      "",
    dueLimitDate:            "",
    processDate:             "",
    domesticRegDecisionDate: "",
    domesticRegDate:         "",
    domesticRegNo:           "",
  },
  cftManagerInfo: {
    deptName: "",
    adminMgr: emptyUser,
    caseMgr:  emptyUser,
    attorney: emptyUser,
  },
  appPartyInfo: {
    foreignAgent: emptyUser,
    client:       emptyUser,
    applicant:    emptyUser,
  },
  appTitleInfo: {
    titleKo: "",
    titleEn: "",
  },
  appGoodsInfo: {
    goodsClass: "",
  },
  cftLitigantInfo: {
    caseTitleKo:    "",
    introducer:     "",
    petitionerType: "",
    petitioner:     emptyUser,
    petitionerMemo: "",
    respondentType: "",
    respondent:     "",
    respondentMemo: "",
  },
  cftNoteInfo: {
    note: "",
  },
  cftJudgmentInfo: {
    preExamDate:         "",
    preExamResult:       "",
    finalResult:         "",
    amendLimitDate:      "",
    amendSubmitDate:     "",
    judgmentServedDate:  "",
    judgmentDate:        "",
    decisionContent:     "",
    appealContent:       "",
    appealLimitDate:     "",
    appealDate:          "",
    isAbandoned:         "",
    abandonInstructDate: "",
    abandonDate:         "",
    abandonContent:      "",
  },
  conflictSeq: "",
};

export const useEtcCaseForm = () => {
  return useForm<EtcCaseFormInput>({
    resolver: zodResolver(EtcCaseSchema),
    defaultValues,
    mode: "onChange",
  });
};
