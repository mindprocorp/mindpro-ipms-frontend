import { type ApiClient } from "@repo/api";
import type { ApiResponse } from "@shared/commonType.ts";

// 로그인 요청
export type LoginRequest = {
  userId: string;
  userPw: string;
};

// 로그인 응답
export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  userSq: number;
  userId: string;
  userNm: string;
  userRole: string;
  useYn: string;
  regDate: string;
  };

// 개인 회원가입 요청
export type RegisterRequest = {
  userCategoryCode: "INDIVIDUAL";
  userEmail: string;
  userPassword: string;
  userName: string;
  mobileNo?: string;
  userAddr?: string;
  userAddrDetail?: string;
  userZipCode?: string;
  termsAgree: boolean;
  privacyPolicyAgree: boolean;
  marketingAgree?: boolean;
  officeId?: string;
};

// 사업자 회원가입 요청
export type RegisterCorporateRequest = {
  userCategoryCode: "CORPORATE";
  userEmail: string;
  userPassword: string;
  userName: string;
  mobileNo?: string;
  userAddr?: string;
  userAddrDetail?: string;
  userZipCode?: string;
  termsAgree: boolean;
  privacyPolicyAgree: boolean;
  marketingAgree?: boolean;
  corpInfo: {
    corpType?: string;
    corpName?: string;
    ceoName?: string;
    corpTel?: string;
    corpFax?: string;
    corpAddr?: string;
    corpAddrDetail?: string;
    corpZipCode?: string;
    corpRegNumber?: string;
  };
};

// 아이디 찾기 요청
export type FindIdRequest = {
  userNameKo: string;
  userMobileNo: string;
};

// 아이디 찾기 응답
export type FindIdResponse = {
  maskedUserId: string;
  registeredDate: string;
};

// 비밀번호 찾기 요청
export type ForgotPasswordRequest = {
  userId: string;
  userNameKo: string;
  userMobileNo: string;
};

// 비밀번호 재설정 요청
export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
};

export function usersApi(client: ApiClient) {
  return {
    // 로그인
    login: async (payload: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
      const { data } = await client.axios.post<ApiResponse<LoginResponse>>("/api/auth/login", payload);
      return data;
    },

    // 개인 회원가입
    register: async (payload: RegisterRequest): Promise<string> => {
      const { data } = await client.axios.post<string>("/api/users/register/individual", payload);
      return data;
    },

    // 사업자 회원가입
    registerCorporate: async (payload: RegisterCorporateRequest & { bizFile?: File }): Promise<string> => {
      const { bizFile, ...requestData } = payload;
      const formData = new FormData();
      formData.append("data", new Blob([JSON.stringify(requestData)], { type: "application/json" }));
      if (bizFile) formData.append("bizFile", bizFile);
      const { data } = await client.axios.post<string>("/api/users/register/corporate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },

    // 아이디 찾기
    findId: async (payload: FindIdRequest): Promise<ApiResponse<FindIdResponse>> => {
      const { data } = await client.axios.post<ApiResponse<FindIdResponse>>("/api/auth/find-id", payload);
      return data;
    },

    // 비밀번호 찾기 (임시 비밀번호 발급)
    forgotPassword: async (payload: ForgotPasswordRequest): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.post<ApiResponse<void>>("/api/auth/forgot-password", payload);
      return data;
    },

    // 비밀번호 재설정
    resetPassword: async (payload: ResetPasswordRequest): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.post<ApiResponse<void>>("/api/auth/reset-password", payload);
      return data;
    },

    // 아이디 중복 확인
    checkDuplicate: async (userId: string): Promise<ApiResponse<boolean>> => {
      const { data } = await client.axios.get<ApiResponse<boolean>>("/api/auth/check-duplicate", {
        params: { userId },
      });
      return data;
    },

    // 전화번호 중복 확인
    checkPhone: async (mobileNo: string): Promise<ApiResponse<boolean>> => {
      const { data } = await client.axios.get<ApiResponse<boolean>>("/api/auth/check-phone", {
        params: { mobileNo },
      });
      return data;
    },

    // 이메일 인증 코드 발송
    sendVerification: async (email: string): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.post<ApiResponse<void>>("/api/auth/send-verification", null, {
        params: { email },
      });
      return data;
    },

    // 이메일 인증 코드 확인
    verifyEmail: async (email: string, code: string): Promise<ApiResponse<boolean>> => {
      const { data } = await client.axios.post<ApiResponse<boolean>>("/api/auth/verify-email", null, {
        params: { email, code },
      });
      return data;
    },

    // 로그아웃 이력 저장 (임의 경로)
    logoutHistory: async (): Promise<ApiResponse<void>> => {
      const { data } = await client.axios.post<ApiResponse<void>>("/api/history/login/logout");
      return data;
    },
  };
}
