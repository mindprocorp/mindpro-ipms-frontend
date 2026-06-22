import {
  usersApi,
  commonApi,
  type LoginRequest,
  type RegisterRequest,
  type RegisterCorporateRequest,
} from "@repo/api";
import { publicApiClient } from "@shared/api/client";
import { mutationOptions } from "@tanstack/react-query";

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

  // 개인 회원가입
  register: () =>
    mutationOptions({
      mutationFn: (payload: RegisterRequest) => usersApi(publicApiClient).register(payload),
    }),

  // 사업자 회원가입
  registerCorporate: () =>
    mutationOptions({
      mutationFn: (payload: RegisterCorporateRequest) =>
        usersApi(publicApiClient).registerCorporate(payload),
    }),
};
