import { apiClient } from "../api/client";
import { useAlertStore } from "../store/useAlertStore";

/**
 * URL을 통해 파일을 다운로드하는 유틸리티
 * 브라우저가 파일을 미리보기(PDF, 이미지 등)하지 않고 강제로 다운로드하도록 Blob을 사용합니다.
 * 
 * @param url 다운로드할 파일의 URL
 * @param fileName 저장할 파일명
 */
// 유효한 외부 URL 인지 검증 (http/https 프로토콜만 허용)
const isValidDownloadUrl = (url: string): boolean => {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed === "/" || trimmed === "null" || trimmed === "undefined") return false;
  return /^https?:\/\//i.test(trimmed);
};

/**
 * 파일 미리보기/열기 — url 유효성 검증 후 새 탭으로 오픈.
 * 잘못된 url(빈/"/"/"null" 등)은 새 탭에서 현재 도메인 루트로 이동하는 부작용을 일으키므로 차단.
 */
export const openFile = (url: string) => {
  if (!isValidDownloadUrl(url)) {
    useAlertStore.getState().openAlert({
      message: "열람 가능한 파일이 없습니다.",
      confirmText: "확인",
    });
    return;
  }
  window.open(url, "_blank");
};

export const downloadFile = async (url: string, fileName: string) => {
  if (!isValidDownloadUrl(url)) {
    useAlertStore.getState().openAlert({
      message: "다운로드 가능한 파일이 없습니다.",
      confirmText: "확인",
    });
    return;
  }

  try {
    // NCloud 직접 호출 시 CORS 문제가 발생하므로, 백엔드 프록시 API를 사용합니다.
    // apiClient.axios의 baseURL이 이미 설정되어 있으므로 상대 경로를 사용합니다.
    const proxyUrl = `/api/v1/files/download?fileUrl=${encodeURIComponent(url)}`;

    // 백엔드 프록시를 통해 파일을 Blob으로 가져옵니다. (Auth 토큰 포함)
    const response = await apiClient.axios.get(proxyUrl, {
      responseType: "blob",
    });

    const blob = response.data;
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName || "download";
    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      window.URL.revokeObjectURL(blobUrl);
    }, 100);
  } catch (error) {
    console.error("다운로드 실패 (프록시):", error);
    useAlertStore.getState().openAlert({
      message: "파일 다운로드에 실패했습니다.",
      confirmText: "확인",
    });
    // window.open fallback 제거 — 빈/잘못된 url일 때 대시보드로 이동하는 부작용 방지
  }
};

export const downloadZipFiles = async (fileSeqs: string[], zipFileName: string) => {
  if (!fileSeqs || fileSeqs.length === 0) {
    useAlertStore.getState().openAlert({
      message: "다운로드 가능한 파일이 없습니다.",
      confirmText: "확인",
    });
    return;
  }

  try {
    const proxyUrl = `/api/v1/files/download-zip`;

    const response = await apiClient.axios.post(proxyUrl, { fileSeqs }, {
      responseType: "blob",
    });

    const blob = response.data;
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    // 1개일 경우엔 서버에서 원본 파일명으로 다운로드되게 Content-Disposition이 오지만,
    // 클라이언트에서 명시적으로 제어할 수도 있습니다. 우선 zipFileName을 기본으로 씁니다.
    // 만약 단일 파일일 때 응답 헤더의 파일명을 추출하고 싶다면 response.headers['content-disposition']을 파싱해야 합니다.
    const disposition = response.headers['content-disposition'];
    let finalFileName = zipFileName;
    if (disposition && disposition.indexOf('attachment') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) { 
        finalFileName = decodeURIComponent(matches[1].replace(/['"]/g, ''));
      }
    }
    
    link.download = finalFileName || "download.zip";
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      window.URL.revokeObjectURL(blobUrl);
    }, 100);
  } catch (error) {
    console.error("ZIP 다운로드 실패 (프록시):", error);
    useAlertStore.getState().openAlert({
      message: "파일 다운로드에 실패했습니다.",
      confirmText: "확인",
    });
  }
};
