import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ObjectionTrialFormInput, ObjectionTrialSchema } from "@shared/schema/objection-trial/objectionTrialSchema.ts";

const emptyCode = { code: "", codeName: "" };
const emptyUser = { userSeq: "", userName: "" };

export const defaultValues: ObjectionTrialFormInput = {
  cftCaseMng: {
    courtCategory:     emptyCode,
    agentCategory:     emptyCode,
    appClassification: emptyCode,
    rightType:         emptyCode,
    caseType:          emptyCode,
    receiptDate: "",
    ourRef:    "",
    yourRef:   "",
    clientRef: "",
  },
  appBaseInfo: {
    countryCode: emptyCode,
    appDate:          "",
    appNo:            "",
    announcementDate: "",
    regDate:          "",
    intlRegDate:      "",
    regNo:            "",
    dueLimitDate:     "",
    claimDate:        "",
    domesticRegDecisionDate: "",
    domesticRegDate:         "",
    domesticRegNo:           "",
    caseNo:  "",
    appSeq:  "",
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
    appealLimitDate:     "",
    appealDate:          "",
    appealContent:       "",
    isAbandoned:         "",
    abandonInstructDate: "",
    abandonDate:         "",
    abandonContent:      "",
  },
  cftResultList: {
    conflictResultList: [],
  },
  conflictSeq: "",
};

export const useObjectionTrialForm = () => {
  return useForm<ObjectionTrialFormInput>({
    resolver: zodResolver(ObjectionTrialSchema),
    defaultValues,
    mode: "onChange",
  });
};
