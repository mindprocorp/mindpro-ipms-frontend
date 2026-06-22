import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AddressForm,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  FormDialog,
  Icons,
  Input,
  RHF,
  Separator,
} from "@repo/ui";
import { useMutation } from "@tanstack/react-query";
import { commonQueries } from "@shared/query/common/queries";
import { useAuthStore } from "@shared/store/useUserInfoStore";
import { useAlertStore } from "@shared/store/useAlertStore";
import { apiClient } from "@shared/api/client";
import { commAPI } from "@shared/api/common/commApi";
import PasswordChangeModal from "./PasswordChangeModal";
import UserImg from "@repo/assets/images/user.png";
import { officeMembershipApi } from "@shared/api/user/officeMembershipApi";
import LeaveOfficeConfirmModal from "@widgets/office-switcher/LeaveOfficeConfirmModal";
import LeaveLastOfficeChoiceModal from "@widgets/office-switcher/LeaveLastOfficeChoiceModal";
import JoinOfficeModal from "@widgets/office-switcher/JoinOfficeModal";
import UpgradeToCorporateModal from "@widgets/office-switcher/UpgradeToCorporateModal";

// 정보수정 폼 스키마 — 변경 가능한 필드만
// 변경 불가 (별도 절차 필요): 이메일(로그인 ID), 회원구분, 휴대폰(본인 인증 수단)
//   → 상단 프로필 영역에 읽기 전용 표시
const ProfileSchema = z.object({
  userNameKo: z.string().min(1, { message: "이름은 필수입니다." }).default(""),
  userNameEn: z.string().default(""),
  userTelNo: z.string().regex(/^\d*$/, { message: "숫자만 입력해주세요." }).default(""),
  userFaxNo: z.string().regex(/^\d*$/, { message: "숫자만 입력해주세요." }).default(""),
  userPostNo: z.string().default(""),
  userAddr: z.string().default(""),
  userAddrDetail: z.string().default(""),
});

// 비밀번호 변경은 PasswordChangeModal로 분리됨

type ProfileFormInput = z.input<typeof ProfileSchema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ProfileEditModal = ({ open, onOpenChange }: Props) => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const openAlert = useAlertStore((s) => s.openAlert);
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: myOffices = [] } = officeMembershipApi.useMyOffices();
  const [joinOpen, setJoinOpen] = useState(false);
  const [leaveTarget, setLeaveTarget] = useState<{ officeSeq: string; officeName: string } | null>(null);
  const [lastOfficeTarget, setLastOfficeTarget] = useState<{ officeSeq: string; officeName: string; isPersonal: boolean; isSysAdmin: boolean } | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const profileForm = useForm<ProfileFormInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: ProfileSchema.parse({}),
  });

  // 모달 열릴 때 유저 정보 강제 새로고침 (사업자 전환 등으로 인한 stale data 방지)
  useEffect(() => {
    if (open) {
      commAPI(apiClient).getUserInfo().then((res) => {
        if (res?.data) setUser(res.data);
      }).catch(() => { /* fail silently — fallback to existing store user */ });
    }
  }, [open]);

  // user가 (재)로드되면 폼 동기화
  useEffect(() => {
    if (open && user) {
      profileForm.reset({
        userNameKo: user.userNameKo ?? "",
        userNameEn: user.userNameEn ?? "",
        userTelNo: user.userTelNo ?? "",
        userFaxNo: user.userFaxNo ?? "",
        userPostNo: user.userPostNo ?? "",
        userAddr: user.userAddr ?? "",
        userAddrDetail: user.userAddrDetail ?? "",
      });
      setPreviewUrl(user.profileImageUrl ?? null);
      setProfileFile(null);
    }
  }, [open, user]);

  // 정보 수정 mutation
  const updateMutation = useMutation({
    ...commonQueries.updateUser(),
    onSuccess: () => {
      if (user) {
        const values = profileForm.getValues();
        setUser({
          ...user,
          ...values,
          profileImageUrl: previewUrl ?? user.profileImageUrl,
        });
      }
      openAlert({ message: "정보가 수정되었습니다." });
      onOpenChange(false);
    },
  });

  // 프로필 이미지 삭제 mutation
  const deleteImageMutation = useMutation({
    ...commonQueries.deleteProfileImage(),
    onSuccess: () => {
      setPreviewUrl(null);
      setProfileFile(null);
      if (user) {
        setUser({ ...user, profileImageUrl: "" });
      }
      openAlert({ message: "프로필 이미지가 삭제되었습니다." });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      openAlert({ message: "이미지 파일만 업로드 가능합니다." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      openAlert({ message: "파일 크기는 5MB 이하만 가능합니다." });
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setProfileFile(file);
  };

  const handleDeleteImage = () => {
    if (!user) return;
    openAlert({
      message: "프로필 이미지를 삭제하시겠습니까?",
      confirmText: "삭제",
      onConfirm: () => {
        deleteImageMutation.mutate(user.userId);
      },
    });
  };

  const onSubmitProfile = (values: ProfileFormInput) => {
    if (!user) return;
    updateMutation.mutate({
      userId: user.userId,
      payload: values,
      profileImage: profileFile ?? undefined,
    });
  };

  const hasProfileImage = !!(previewUrl || user?.profileImageUrl);

  return (
    <FormProvider {...profileForm}>
      <FormDialog
        title="내정보"
        submitText="저장"
        open={open}
        onOpenChange={onOpenChange}
        onSubmit={profileForm.handleSubmit(onSubmitProfile)}
        className="max-w-xl max-h-[90vh] flex flex-col"
        extraFooter={
          <Button
            type="button"
            variant="outline"
            size="h32"
            className="mr-auto"
            onClick={() => setPwModalOpen(true)}
          >
            비밀번호 변경
          </Button>
        }
      >
        <div className="-mx-2 max-h-[calc(90vh-180px)] overflow-y-auto px-2">
        {/* 프로필 이미지 */}
        <div className="mb-4 flex items-center gap-4">
          <div className="relative">
            <Avatar className="size-18 [&>img]:w-full">
              <AvatarImage src={previewUrl ?? user?.profileImageUrl ?? UserImg} alt="프로필" />
              <AvatarFallback>{user?.userNameKo?.charAt(0) ?? "U"}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-background border-border-100 absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full border shadow-sm"
            >
              <Icons.Camera className="size-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium">{user?.userNameKo ?? ""}</p>
              <span className="text-text-200 text-[10px]">
                {/* 현재 active 사무소 기준 — 회사 소속이면 사업자, USRKR이면 개인 */}
                ({myOffices.find((o) => o.isCurrent)?.officeAuthYn === "Y" ? "사업자" : "개인"})
              </span>
            </div>
            <p className="text-text-200 flex items-center gap-1 text-xs">
              <Icons.Mail className="size-3" />
              {user?.userEmail ?? user?.userId ?? "-"}
            </p>
            <p className="text-text-200 flex items-center gap-1 text-xs">
              <Icons.Phone className="size-3" />
              {user?.userMobileNo
                ? user.userMobileNo.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3")
                : "-"}
            </p>
            {hasProfileImage && (
              <button
                type="button"
                onClick={handleDeleteImage}
                className="text-text-200 hover:text-destructive mt-0.5 flex items-center gap-1 text-xs"
              >
                <Icons.Trash2 className="size-3" />
                기본 이미지로 변경
              </button>
            )}
          </div>
        </div>

        <Separator className="mb-4" />

        {/* 소속 사무소 */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold">소속 사무소</p>
            <Button type="button" size="h28" variant="outline" onClick={() => setJoinOpen(true)}>
              <Icons.Plus className="mr-1 size-3.5" />
              초대코드 합류
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {myOffices.length === 0 ? (
              <p className="text-muted-foreground text-xs">소속된 사무소가 없습니다.</p>
            ) : (
              myOffices.map((o) => (
                <div
                  key={o.officeSeq}
                  className="border-border-100 flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    {o.officeAuthYn === "Y" ? (
                      <Icons.Building2 className="size-4 shrink-0" />
                    ) : (
                      <Icons.User className="size-4 shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium">{o.officeShortName}</span>
                        {o.officeAuthYn === "Y" ? (
                          <span className="text-p-color-1 text-[10px]">[사업자]</span>
                        ) : (
                          <span className="text-text-200 text-[10px]">[개인]</span>
                        )}
                        {o.isCurrent && <span className="text-p-color-1 text-[10px]">· 현재</span>}
                      </div>
                      {(o.roleNm || o.acctStatusCode === "PENDING") && (
                        <div className="text-text-200 text-[11px]">
                          {o.roleNm}
                          {o.roleNm && o.acctStatusCode === "PENDING" && " · "}
                          {o.acctStatusCode === "PENDING" && "승인 대기"}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {o.officeAuthYn === "N" && o.isCurrent && (
                      <Button
                        type="button"
                        size="h28"
                        variant="outline"
                        onClick={() => setUpgradeOpen(true)}
                      >
                        사업자 전환
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="h28"
                      variant="outline"
                      onClick={() => {
                        const target = { officeSeq: o.officeSeq, officeName: o.officeShortName };
                        // 사업주 판정: roleType=SYSTEM_ADMIN OR (사업자 사무소 + admin_auth='Y')
                        const isSysAdmin =
                          o.roleType === "SYSTEM_ADMIN" ||
                          (o.officeAuthYn === "Y" && o.adminAuth === "Y");
                        // 사업주이거나 유일 사무소 → 선택 모달 (안내 또는 선택지)
                        if (isSysAdmin || myOffices.length <= 1) {
                          setLastOfficeTarget({
                            ...target,
                            isPersonal: o.officeAuthYn === "N",
                            isSysAdmin,
                          });
                        } else {
                          setLeaveTarget(target);
                        }
                      }}
                    >
                      탈퇴
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <Separator className="mb-4" />

        {/* 개인정보 수정 — 회원가입 폼과 동일 스타일 (h44, noSpace, inputMode) */}
        <p className="mb-2 text-sm font-semibold">개인정보 수정</p>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <RHF.Input
              size="h44"
              control={profileForm.control}
              name="userNameKo"
              label="이름(한글)"
              ess
              noSpace
            />
            <RHF.Input
              size="h44"
              control={profileForm.control}
              name="userNameEn"
              label="이름(영문)"
              noSpace
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <RHF.Input
              size="h44"
              control={profileForm.control}
              name="userTelNo"
              label="사무실 전화번호"
              inputMode="numeric"
              maxLength={11}
              noSpace
            />
            <RHF.Input
              size="h44"
              control={profileForm.control}
              name="userFaxNo"
              label="팩스번호"
              inputMode="numeric"
              maxLength={11}
              noSpace
            />
          </div>

          <AddressForm
            setValue={profileForm.setValue}
            addressFieldName="userAddr"
            detailFieldName="userAddrDetail"
            zonecodeFieldName="userPostNo"
          />
        </div>

        </div>
      </FormDialog>

      <PasswordChangeModal open={pwModalOpen} onOpenChange={setPwModalOpen} />
      <JoinOfficeModal open={joinOpen} onOpenChange={setJoinOpen} />
      {leaveTarget && (
        <LeaveOfficeConfirmModal
          open
          onOpenChange={(o) => !o && setLeaveTarget(null)}
          officeSeq={leaveTarget.officeSeq}
          officeName={leaveTarget.officeName}
        />
      )}
      {lastOfficeTarget && (
        <LeaveLastOfficeChoiceModal
          open
          onOpenChange={(o) => !o && setLastOfficeTarget(null)}
          officeSeq={lastOfficeTarget.officeSeq}
          officeName={lastOfficeTarget.officeName}
          isPersonalOffice={lastOfficeTarget.isPersonal}
          isSysAdmin={lastOfficeTarget.isSysAdmin}
        />
      )}
      <UpgradeToCorporateModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </FormProvider>
  );
};

export default ProfileEditModal;
