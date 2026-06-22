import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage, Button, FlexBox, FormDialog, Icons, Separator } from "@repo/ui";
import PageTitleArea from "@shared/ui/PageTitleArea";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useAuthStore } from "@shared/store/useUserInfoStore";
import { useAlertStore } from "@shared/store/useAlertStore";
import UserImg from "@repo/assets/images/user.png";
import { fileToDataUrl, loadSignature, removeSignature, saveSignature, type SignatureKind } from "../_common/signatureStorage";
import SignaturePad from "../_common/SignaturePad";

const KIND_LABEL: Record<SignatureKind, string> = {
  signature: "서명",
  stamp: "직인",
};

const SignatureManage = () => {
  const user = useAuthStore((s) => s.user);
  const { openAlert } = useAlertStore();
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [stampUrl, setStampUrl] = useState<string | null>(null);
  const signRef = useRef<HTMLInputElement>(null);
  const stampRef = useRef<HTMLInputElement>(null);

  // 그리기 모달 상태
  const [drawKind, setDrawKind] = useState<SignatureKind | null>(null);
  const [drawnImage, setDrawnImage] = useState<string | null>(null);

  // 등록된 서명/직인 로드 (오피스 + 사용자별)
  useEffect(() => {
    if (!user?.userId || !user?.officeId) return;
    setSignatureUrl(loadSignature(user.officeId, user.userId, "signature"));
    setStampUrl(loadSignature(user.officeId, user.userId, "stamp"));
  }, [user?.officeId, user?.userId]);

  const handleFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    kind: SignatureKind,
    setter: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user?.userId || !user?.officeId) return;
    if (file.size > 1024 * 1024) {
      openAlert({ message: "1MB 이하의 이미지만 업로드 가능합니다." });
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      saveSignature(user.officeId, user.userId, kind, dataUrl);
      setter(dataUrl);
    } catch {
      openAlert({ message: "이미지 변환에 실패했습니다." });
    }
  };

  const handleRemove = (kind: SignatureKind, setter: (url: string | null) => void) => {
    if (!user?.userId || !user?.officeId) return;
    removeSignature(user.officeId, user.userId, kind);
    setter(null);
  };

  const openDraw = (kind: SignatureKind) => {
    setDrawKind(kind);
    setDrawnImage(null);
  };

  const closeDraw = () => {
    setDrawKind(null);
    setDrawnImage(null);
  };

  const submitDraw = () => {
    if (!drawKind || !drawnImage || !user?.userId || !user?.officeId) return;
    saveSignature(user.officeId, user.userId, drawKind, drawnImage);
    if (drawKind === "signature") setSignatureUrl(drawnImage);
    else setStampUrl(drawnImage);
    closeDraw();
  };

  return (
    <>
      <PageTitleArea className="pb-2" title="서명 관리" />

      {/* 프로필 */}
      <div className="mb-4 flex items-center gap-4">
        <Avatar className="size-16 [&>img]:w-full">
          <AvatarImage src={user?.profileImageUrl || UserImg} alt="프로필" />
          <AvatarFallback>{user?.userNameKo?.charAt(0) ?? "U"}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold">{user?.userNameKo ?? ""}</p>
          <p className="text-text-200 text-xs">{user?.userId ?? ""}</p>
          <p className="text-text-200 text-xs">
            {[user?.deptName, user?.userPosition].filter(Boolean).join(" / ")}
          </p>
        </div>
      </div>

      <Separator className="mb-4" />

      <FlexBox className="gap-4">
        {/* 서명 */}
        <FormUnitBox title="서명" className="flex-1 inset-shadow-none" vertical>
          <FlexBox className="mb-3 justify-end gap-1">
            <Button size="h28" variant="outline" onClick={() => openDraw("signature")}>
              <Icons.Pencil className="size-3.5" /> 그리기
            </Button>
            <Button size="h28" variant="outline" onClick={() => signRef.current?.click()}>
              <Icons.Upload className="size-3.5" /> {signatureUrl ? "변경" : "등록"}
            </Button>
            {signatureUrl && (
              <Button size="h28" variant="outline-pink" onClick={() => handleRemove("signature", setSignatureUrl)}>
                <Icons.Trash2 className="size-3.5" /> 삭제
              </Button>
            )}
          </FlexBox>
          <input ref={signRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, "signature", setSignatureUrl)} />
          <div className="flex h-32 items-center justify-center rounded-md border-2 border-dashed bg-muted/20">
            {signatureUrl ? (
              <img src={signatureUrl} alt="서명" className="max-h-28 object-contain" />
            ) : (
              <p className="text-xs text-muted-foreground">서명을 등록하거나 직접 그려주세요</p>
            )}
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">이미지 업로드: PNG, JPG (투명배경 권장, 200x80px, 1MB 이하)</p>
        </FormUnitBox>

        {/* 직인 */}
        <FormUnitBox title="직인" className="flex-1 inset-shadow-none" vertical>
          <FlexBox className="mb-3 justify-end gap-1">
            <Button size="h28" variant="outline" onClick={() => openDraw("stamp")}>
              <Icons.Pencil className="size-3.5" /> 그리기
            </Button>
            <Button size="h28" variant="outline" onClick={() => stampRef.current?.click()}>
              <Icons.Upload className="size-3.5" /> {stampUrl ? "변경" : "등록"}
            </Button>
            {stampUrl && (
              <Button size="h28" variant="outline-pink" onClick={() => handleRemove("stamp", setStampUrl)}>
                <Icons.Trash2 className="size-3.5" /> 삭제
              </Button>
            )}
          </FlexBox>
          <input ref={stampRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, "stamp", setStampUrl)} />
          <div className="flex h-32 items-center justify-center rounded-md border-2 border-dashed bg-muted/20">
            {stampUrl ? (
              <img src={stampUrl} alt="직인" className="max-h-28 object-contain" />
            ) : (
              <p className="text-xs text-muted-foreground">직인을 등록하거나 직접 그려주세요</p>
            )}
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">이미지 업로드: PNG, JPG (투명배경 권장, 100x100px, 1MB 이하)</p>
        </FormUnitBox>
      </FlexBox>

      <p className="text-text-200 mt-4 text-[11px]">
        * 등록된 서명/직인은 결재 화면에서 본인 서명 입력 시 자동으로 사용됩니다.
      </p>

      {/* 공문서 풋터 미리보기 — 실제 결재 화면에서 보일 모습 */}
      <div className="mt-6 rounded-md border bg-card p-6">
        <p className="mb-3 text-xs font-semibold text-foreground">결재 문서 하단 미리보기</p>
        <div className="rounded-sm border bg-background p-6">
          <div className="border-b-2 border-foreground/70" />
          <div className="mt-[3px] border-b border-foreground/40" />
          <div className="flex flex-col items-end gap-2 pt-6 text-sm">
            <div className="text-foreground">
              <span className="text-muted-foreground">상신일</span>{" "}
              <span className="font-medium">
                {new Date().getFullYear()}년 {new Date().getMonth() + 1}월 {new Date().getDate()}일
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-foreground">{user?.userNameKo ?? "(이름)"}</span>
              <div className="flex h-10 min-w-[64px] items-center justify-center">
                {signatureUrl ? (
                  <img src={signatureUrl} alt="(서명)" className="max-h-full max-w-[80px] object-contain" />
                ) : (
                  <span className="text-muted-foreground">(서명)</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-foreground">{user?.userNameKo ?? "(이름)"}</span>
              <div className="flex h-10 min-w-[64px] items-center justify-center">
                {stampUrl ? (
                  <img src={stampUrl} alt="(직인)" className="max-h-full max-w-[80px] object-contain" />
                ) : (
                  <span className="text-muted-foreground">(직인)</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 그리기 모달 */}
      <FormDialog
        open={drawKind !== null}
        onOpenChange={(v) => !v && closeDraw()}
        title={drawKind ? `${KIND_LABEL[drawKind]} 그리기` : ""}
        submitText="저장"
        cancelText="취소"
        submitDisabled={!drawnImage}
        onSubmit={submitDraw}
        className="max-w-md"
      >
        <div className="space-y-3">
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Icons.Pencil className="size-3.5" />
            아래 영역에 마우스로 직접 그려주세요
          </p>
          <SignaturePad onChange={setDrawnImage} height={drawKind === "stamp" ? 200 : 150} />
        </div>
      </FormDialog>
    </>
  );
};

export default SignatureManage;
