import type { CodeDetail, CodeResponseTypeNew } from "@shared/api/common/commApi.ts";


/**
 *
 * @param grpCd 그룹코드
 * @param targetCodeList 모든코드리스트
 */
export const getCodeList = (grpCd : string , targetCodeList : CodeResponseTypeNew) : CodeDetail[] => {
  return targetCodeList[grpCd];
}