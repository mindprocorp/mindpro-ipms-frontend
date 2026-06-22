import { type ApiClient } from "@repo/api";

export type EmployeeVO = {
  userMstSeq?: string;
  userInfoSeq?: string;
  officeSeq?: string;
  userId?: string;
  userNameKo: string;
  userNameEn?: string;
  userEmail?: string;
  userMobileNo?: string;
  userTelNo?: string;
  userFaxNo?: string;
  userPostNo?: string;
  userAddr?: string;
  userAddrDetail?: string;
  deptName?: string;
  deptCode?: string;
  userPosition?: string;
  profileImageUrl?: string;
  userCategoryCode?: string;
  useYn?: string;
  createAt?: string;
  // utb_office_employee
  officeEmployeeSeq?: string;
  adminAuth?: string;
  officeEmployeePosition?: string;
  officeEmployeeDept?: string;
  workCode?: string;
  positionCode?: string;
  jobGradeCode?: string;
  deptSeq?: string;
  userType?: { code: string; name: string };
  workStatus?: { code: string; name: string };
  employStatus?: { code: string; name: string };
  acctStatus?: { code: string; name: string };
  role?: { code: string; name: string };
};

export type EmployeeSearchParams = {
  userNameKo?: string;
  officeEmployeeSeq?: string;
  officeEmployeeDept?: string;
  jobGradeCode?: string;
};

export function employeeApi(client: ApiClient) {
  return {
    // 직원 목록 검색 (통합) — 백엔드 SQL에서 PENDING 제외 처리됨
    getList: async (params: EmployeeSearchParams) => {
      const { data } = await client.axios.get("/api/users/search/userinfo/list", {
        params: {
          userNameKo: params.userNameKo || "",
          officeEmployeeSeq: params.officeEmployeeSeq || undefined,
          officeEmployeeDept: params.officeEmployeeDept || undefined,
          jobGradeCode: params.jobGradeCode || undefined,
        },
      });
      return (data.data ?? []) as EmployeeVO[];
    },

    // 승인 대기 직원만 조회 (직원 승인 탭 전용 엔드포인트)
    getPendingList: async () => {
      const { data } = await client.axios.get("/api/users/pending-employees");
      return (data.data ?? []) as EmployeeVO[];
    },

    // 직원 정보 수정 (조직 배치)
    update: async (payload: {
      userMstSeq: string;
      userNameKo?: string;
      userEmail?: string;
      userMobileNo?: string;
      userAddr?: string;
      userAddrDetail?: string;
      userPostNo?: string;
      deptName?: string;
      userPosition?: string;
      jobGradeCode?: string;
      workCode?: string;
      userTypeCode?: string;
      workStatusCode?: string;
      employStatusCode?: string;
      acctStatusCode?: string;
      roleSeq?: string;
      updateUser?: string;
    }) => {
      const { data } = await client.axios.put("/api/users/employee", payload);
      return data;
    },

    // 직원 승인 거절 (사무소 소속 해제, 사용자 계정은 유지)
    reject: async (userMstSeq: string) => {
      const { data } = await client.axios.delete(`/api/users/employee/${userMstSeq}`);
      return data;
    },

    // 관리자가 직접 직원 등록 (승인 절차 없이 즉시 사용중 + 역할/조직/상태 동시 적용)
    adminCreate: async (payload: {
      // 계정
      userEmail: string;
      userPassword: string;
      userName: string;
      mobileNo?: string;
      userCategoryCode: "INDIVIDUAL";
      officeId?: string;
      termsAgree: boolean;
      privacyPolicyAgree: boolean;
      marketingAgree?: boolean;
      // 조직 정보
      roleSeq?: string;
      officeEmployeePosition?: string;
      officeEmployeeDept?: string;
      positionCode?: string;
      jobGradeCode?: string;
      workCode?: string;
      // 상태
      userTypeCode?: string;
      workStatusCode?: string;
      employStatusCode?: string;
    }) => {
      const { data } = await client.axios.post("/api/users/admin/employee", payload);
      return data;
    },
  };
}
