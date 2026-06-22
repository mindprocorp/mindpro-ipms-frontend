import { publicApiClient } from "../../shared/api/client";
import { mutationOptions } from "@tanstack/react-query";
import {
  commonApi,
} from "@repo/api";
import {
  type LoginRequest,
  type RegisterCorporateRequest,
  type RegisterRequest,
  type FindIdRequest,
  type ForgotPasswordRequest,
  type ResetPasswordRequest,
  usersApi,
} from "@shared/api/auth/users.ts";


// 공통 API
export const commonApis = {
  // 사무소 목록 조회
  getOffices: () => commonApi(publicApiClient).getRegistry("office"),
};


export const userQueries = {
  // 로그인
  login: () =>
    mutationOptions({
      mutationFn: (payload: LoginRequest) => usersApi(publicApiClient).login(payload),
    }),

  // 개인 회원가입 (공개 - 미로그인 상태)
  register: () =>
    mutationOptions({
      mutationFn: (payload: RegisterRequest) => usersApi(publicApiClient).register(payload),
    }),

  // 사업자 회원가입
  registerCorporate: () =>
    mutationOptions({
      mutationFn: (payload: RegisterCorporateRequest & { bizFile?: File }) =>
        usersApi(publicApiClient).registerCorporate(payload),
    }),

  // 아이디 찾기
  findId: () =>
    mutationOptions({
      mutationFn: (payload: FindIdRequest) => usersApi(publicApiClient).findId(payload),
    }),

  // 비밀번호 찾기
  forgotPassword: () =>
    mutationOptions({
      mutationFn: (payload: ForgotPasswordRequest) => usersApi(publicApiClient).forgotPassword(payload),
    }),

  // 비밀번호 재설정
  resetPassword: () =>
    mutationOptions({
      mutationFn: (payload: ResetPasswordRequest) => usersApi(publicApiClient).resetPassword(payload),
    }),

  // 아이디 중복 확인
  checkDuplicate: () =>
    mutationOptions({
      mutationFn: (userId: string) => usersApi(publicApiClient).checkDuplicate(userId),
    }),

  // 전화번호 중복 확인
  checkPhone: () =>
    mutationOptions({
      mutationFn: (mobileNo: string) => usersApi(publicApiClient).checkPhone(mobileNo),
    }),

  // 이메일 인증 코드 발송
  sendVerification: () =>
    mutationOptions({
      mutationFn: (email: string) => usersApi(publicApiClient).sendVerification(email),
    }),

  // 이메일 인증 코드 확인
  verifyEmail: () =>
    mutationOptions({
      mutationFn: ({ email, code }: { email: string; code: string }) =>
        usersApi(publicApiClient).verifyEmail(email, code),
    }),
};

