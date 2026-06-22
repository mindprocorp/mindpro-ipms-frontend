/**
 * 서명/직인 이미지 로컬 저장소
 * - 서버 API가 정해지기 전까지는 (오피스 + 사용자)별 localStorage에 base64로 저장
 * - 결재 시 FormRenderer가 이 모듈을 통해 등록된 서명을 가져와 표시
 */

const KEY_PREFIX = "ipms.approval.signature.";

export type SignatureKind = "signature" | "stamp";

const storageKey = (officeId: string, userId: string, kind: SignatureKind) =>
  `${KEY_PREFIX}${officeId}.${userId}.${kind}`;

export const loadSignature = (
  officeId: string | undefined,
  userId: string | undefined,
  kind: SignatureKind,
): string | null => {
  if (!officeId || !userId) return null;
  try { return localStorage.getItem(storageKey(officeId, userId, kind)); } catch { return null; }
};

export const saveSignature = (
  officeId: string | undefined,
  userId: string | undefined,
  kind: SignatureKind,
  dataUrl: string,
): void => {
  if (!officeId || !userId) return;
  try { localStorage.setItem(storageKey(officeId, userId, kind), dataUrl); } catch {}
};

export const removeSignature = (
  officeId: string | undefined,
  userId: string | undefined,
  kind: SignatureKind,
): void => {
  if (!officeId || !userId) return;
  try { localStorage.removeItem(storageKey(officeId, userId, kind)); } catch {}
};

/** File → base64 dataURL */
export const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
