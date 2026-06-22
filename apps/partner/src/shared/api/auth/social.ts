import { publicApiClient } from "@shared/api/client";

const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;

const REDIRECT_BASE = window.location.origin;

export const socialAuthUrls = {
  kakao: () =>
    `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_BASE}/auth/kakao/callback&response_type=code`,

  naver: () =>
    `https://nid.naver.com/oauth2.0/authorize?client_id=${NAVER_CLIENT_ID}&redirect_uri=${REDIRECT_BASE}/auth/naver/callback&response_type=code&state=${crypto.randomUUID()}`,

  google: () => {
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_BASE}/auth/google/callback&response_type=code&scope=email%20profile&prompt=select_account`;
  },
};

export interface SocialLoginResponse {
  authenticated: boolean;
  newUser: boolean;
  loginResponse?: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    userInfoSeq: string;
    userMstSeq: string;
    officeSeq: string;
    userNm: string;
    userRole: string;
  };
  socialEmail?: string;
  socialName?: string;
  provider: string;
  providerId: string;
}

export const socialCheckAccount = async (
  userName: string,
  mobileNo: string,
): Promise<{ maskedUserId: string; registeredDate: string } | null> => {
  const res = await publicApiClient.axios.post("/api/auth/social/check", null, {
    params: { userName, mobileNo },
  });
  return res.data.data;
};

export const socialLinkAccount = async (
  userName: string,
  mobileNo: string,
  provider: string,
  providerId: string,
  socialEmail?: string,
): Promise<SocialLoginResponse> => {
  const res = await publicApiClient.axios.post("/api/auth/social/link", null, {
    params: { userName, mobileNo, provider, providerId, socialEmail },
  });
  return res.data.data;
};

export const socialLogin = async (
  provider: string,
  code: string,
  redirectUri: string,
): Promise<SocialLoginResponse> => {
  const res = await publicApiClient.axios.post(`/api/auth/social/${provider}`, {
    code,
    redirectUri,
  });
  return res.data.data;
};
