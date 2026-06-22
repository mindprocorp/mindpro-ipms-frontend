import type { UseFormSetValue } from "react-hook-form";

/**
 * QA 목적으로 폼의 빈 항목들(Modal 필수값 제외)을 임시 데이터로 채워주는 유틸리티
 * @param setValue react-hook-form의 setValue 함수
 * @param schemaData 폼의 데이터 구조 (기본값 객체 등)
 */
export type FormFillOptions = {
  prefix?: string;
  workType?: "DOMESTIC" | "OVERSEAS" | "BILL" | "CUSTOMER" | "TRIAL" | "ETC" | string;
};

/**
 * QA 목적으로 폼의 빈 항목들(Modal 필수값 제외)을 임시 데이터로 채워주는 유틸리티
 * @param setValue react-hook-form의 setValue 함수
 * @param schemaData 폼의 데이터 구조 (기본값 객체 등)
 * @param options 설정 옵션 (prefix, workType 등)
 */
export const fillFormWithDummyData = (
  setValue: UseFormSetValue<any>,
  schemaData: any,
  options?: FormFillOptions | string
) => {
  if (!schemaData) return;

  // 옵션 처리 (문자열인 경우 prefix로 간주 - 하위 호환성)
  const prefix = typeof options === "string" ? options : options?.prefix || "";
  const workType = typeof options === "object" ? options?.workType : undefined;

  Object.entries(schemaData).forEach(([key, value]) => {
    const fieldName = prefix ? `${prefix}.${key}` : key;
    const lowerKey = key.toLowerCase();

    // 1. 주요 마스터 키 시퀀스 값 패턴 제외 (업무별 분기)
    let isProtected = false;

    // 공통 제외 (PK성 ID 등)
    if (
      lowerKey === "id" ||
      lowerKey === "multiviewdrawingfile" ||
      lowerKey === "fileinfo"
    ) {
      isProtected = true;
    }

    // 업무별 PK 제외 로직
    if (workType === "DOMESTIC") {
      if (lowerKey === "appseq" || lowerKey === "domesticseq") isProtected = true;
    } else if (workType === "OVERSEAS") {
      if (lowerKey === "appseq" || lowerKey === "overseasseq") isProtected = true;
    } else if (workType === "BILL") {
      if (lowerKey === "billseq" || lowerKey === "invoiceseq" || lowerKey === "receiptseq") isProtected = true;
    } else if (workType === "CUSTOMER") {
      if (lowerKey === "customerseq") isProtected = true;
    } else if (workType === "TRIAL") {
      if (lowerKey === "conflictseq") isProtected = true;
      // TRIAL 업무에서 appSeq는 보통 참조용(원출원번호 검색용)이므로 채워도 됨 (isProtected 유지 X)
    } else if (workType === "ETC") {
      if (lowerKey === "etcseq") isProtected = true;
    } else {
      // 업무 정보가 없는 경우 기존처럼 보수적으로 다 제외
      if (
        lowerKey === "appseq" ||
        lowerKey === "customerseq" ||
        lowerKey === "overseasseq" ||
        lowerKey === "domesticseq" ||
        lowerKey === "billseq" ||
        lowerKey === "invoiceseq" ||
        lowerKey === "conflictseq" ||
        lowerKey === "casecategory"
      ) {
        isProtected = true;
      }
    }

    if (isProtected) return;

    // 2. 특수 필드 (배열/복합 객체) 직접 처리
    if (lowerKey === "appcounterpartyinfo") {
      fillFormWithDummyData(setValue, value, { prefix: fieldName, workType });
      return;
    }

    // 3. 배열 형태인 당사자 정보 처리 (의뢰인, 출원인, 등록권리자 등)
    const counterPartyKeys = ["clientinfo", "applicantinfo", "regmgrinfo"];
    if (counterPartyKeys.includes(lowerKey)) {
      setValue(fieldName, [
        { counterPartySeq: "CUST20260000001", counterPartyName: "QA 테스트 업체" }
      ], { shouldValidate: true, shouldDirty: true });
      return;
    }

    // 4. 객체인 경우 재귀 호출 처리
    if (value && typeof value === "object" && !Array.isArray(value)) {
      fillFormWithDummyData(setValue, value, { prefix: fieldName, workType });
      return;
    }

    // 5. 일반 배열인 경우 건너뜀
    if (Array.isArray(value)) {
      return;
    }

    // 6. 타입별 더미 데이터 생성 및 주입
    let dummyValue: any = "";

    if (lowerKey === "code" || lowerKey.includes("category")) {
      dummyValue = "10";
      const lowerPrefix = (prefix || "").toLowerCase();
      if (lowerPrefix.includes("invtype")) {
        dummyValue = "100";
      } else if (lowerPrefix.includes("inv")) {
        dummyValue = "10";
      }
    } else if (lowerKey === "codename") {
      dummyValue = "특허";
      if ((prefix || "").toLowerCase().includes("category")) dummyValue = "일반";
      if ((prefix || "").toLowerCase().includes("inv")) dummyValue = "기본청구";
    } else if (lowerKey.includes("userseq") || lowerKey.includes("memberseq") || lowerKey === "attorneyseq") {
      dummyValue = "USERIF20260000031";
    } else if (lowerKey === "username") {
      dummyValue = "김사업사업가";
    } else if (lowerKey === "countrycode") {
      dummyValue = "KR";
    } else if (lowerKey === "countrynameko") {
      dummyValue = "대한민국";
    } else if (lowerKey === "countrynameen") {
      dummyValue = "Republic of Korea";
    } else if (
      lowerKey.includes("date") ||
      lowerKey.includes("deadline") ||
      lowerKey.includes("limit") ||
      lowerKey.includes("days") ||
      lowerKey.includes("period") ||
      lowerKey.endsWith("dt") ||
      lowerKey.includes("at") ||
      lowerKey.includes("instruct") ||
      lowerKey.includes("time")
    ) {
      dummyValue = "20260417";
    } else if (lowerKey.includes("email")) {
      dummyValue = "qa_test@mindpro.co.kr";
    } else if (lowerKey.includes("homepage") || lowerKey.includes("url") || lowerKey.includes("link")) {
      dummyValue = "https://www.mindpro.co.kr";
    } else if (lowerKey.includes("phone") || lowerKey.includes("tel") || lowerKey.includes("contact")) {
      dummyValue = "010-1234-5678";
    } else if (lowerKey === "appno") {
      dummyValue = "4020250219818";
    } else if (lowerKey === "appseq") {
      dummyValue = "APPMST20260000504";
    } else if (lowerKey === "ourref") {
      dummyValue = "TEST";
    } else if (lowerKey.includes("no") || lowerKey.includes("ref")) {
      dummyValue = "QA-2026-0001";
    } else if (lowerKey === "bizregno") {
      dummyValue = "123-45-00789";
    } else if (lowerKey.includes("addr")) {
      dummyValue = "서울특별시 강남구 테헤란로 123";
    } else if (lowerKey.includes("claims") || lowerKey.includes("count") || lowerKey.includes("page")) {
      dummyValue = typeof value === "string" ? "5" : 5;
    } else if (lowerKey === "exchangerate") {
      dummyValue = 1350;
    } else if (
      lowerKey.includes("fee") ||
      lowerKey.includes("amount") ||
      lowerKey.includes("cost") ||
      lowerKey.includes("price") ||
      lowerKey.includes("vat") ||
      lowerKey.includes("tax") ||
      lowerKey.includes("money")
    ) {
      dummyValue = typeof value === "string" ? "10000" : 10000;
    } else if (lowerKey === "petitionertype") {
      dummyValue = "Y";
    } else if (lowerKey === "respondenttype") {
      dummyValue = "N";
    } else if (
      lowerKey.startsWith("is") ||
      lowerKey.startsWith("has") ||
      lowerKey.endsWith("yn") ||
      lowerKey.includes("flag")
    ) {
      dummyValue = "Y"; // Radio 버튼 (Y/N) 및 char(1) 대응
    } else if (lowerKey.includes("title") || lowerKey.includes("ko") || lowerKey === "invcontent" || lowerKey === "note") {
      dummyValue = "QA 테스트용 " + key;
      if (lowerKey.includes("title")) dummyValue = "연구 개발 및 서비스 운영 프로세스 개선안";
      if (lowerKey.includes("content")) dummyValue = "이것은 시스템 테스트를 위한 상세 내용입니다.";
      if (lowerKey === "note") dummyValue = "테스트 비고 사항입니다.";
      if (lowerKey === "bizname") dummyValue = "(주)마인드프로";
      if (lowerKey === "bizceo") dummyValue = "홍길동";
    } else if (lowerKey.includes("en")) {
      dummyValue = "QA Test " + key;
      if (lowerKey.includes("title")) dummyValue = "Research and Development Process Improvement";
    } else if (typeof value === "number") {
      dummyValue = 10;
    } else if (typeof value === "boolean") {
      dummyValue = true;
    } else {
      dummyValue = "임시_" + key;
    }

    setValue(fieldName, dummyValue, { shouldValidate: true, shouldDirty: true });
  });
};
