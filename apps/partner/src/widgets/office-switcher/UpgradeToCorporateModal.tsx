import { useState } from "react";
import { FormDialog } from "@repo/ui";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@shared/api/client";
import { commAPI } from "@shared/api/common/commApi";
import { useAuthStore } from "@shared/store/useUserInfoStore";
import { useAlertStore } from "@shared/store/useAlertStore";
import CorporationForm from "@widgets/auth/join-form/ui/CorporationForm";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * 회원가입 사업자 폼 그대로 재사용 (CorporationForm).
 * 가입 컨텍스트가 아닌 "전환" 컨텍스트만 차이 — 백엔드 호출만 다름.
 */
const Schema = z
  .object({
    cropType: z.string().min(1, { message: "회사 가입구분을 선택해주세요." }),
    corpRegNumber: z
      .string()
      .regex(/^\d*$/, { message: "숫자만 입력해주세요." })
      .regex(/^\d{10}$/, { message: "10자리를 입력해주세요." }),
    corpRegVerified: z.boolean().default(false),
    ceoName: z
      .string()
      .min(1, { message: "대표자명을 입력해주세요." })
      .regex(/^[가-힣a-zA-Z]+$/, { message: "한글 또는 영문만 입력해주세요." }),
    corpName: z.string().trim().min(1, { message: "회사명을 입력해주세요." }),
    corpPhone: z.string().regex(/^\d*$/, { message: "숫자만 입력해주세요." }).optional(),
    corpFax: z.string().regex(/^\d*$/, { message: "숫자만 입력해주세요." }).optional(),
    corpZonecode: z.string().optional(),
    corpAddress: z.string().trim().optional(),
    corpAddressDetail: z.string().trim().optional(),
    corpPaperUrl: z.string().min(1, { message: "사업자등록증을 첨부해주세요." }),
  })
  .superRefine((data, ctx) => {
    if (!data.corpRegVerified) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "사업자등록번호 검증이 필요합니다.",
        path: ["corpRegNumber"],
      });
    }
  });

type Input = z.input<typeof Schema>;

const UpgradeToCorporateModal = ({ open, onOpenChange }: Props) => {
  const { setToken, setRefreshToken, setUser } = useAuthStore();
  const { openAlert } = useAlertStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [bizFile, setBizFile] = useState<File | null>(null);

  const form = useForm<Input>({
    resolver: zodResolver(Schema),
    defaultValues: {
      cropType: "1",
      corpRegNumber: "",
      corpRegVerified: false,
      ceoName: "",
      corpName: "",
      corpPhone: "",
      corpFax: "",
      corpZonecode: "",
      corpAddress: "",
      corpAddressDetail: "",
      corpPaperUrl: "",
    },
  });

  const upgradeMutation = useMutation({
    mutationFn: async (values: Input) => {
      const formData = new FormData();
      const corpInfo = {
        corpType: values.cropType === "2" ? "PATENT_OFFICE" : "GENERAL",
        corpName: values.corpName,
        ceoName: values.ceoName,
        corpRegNumber: values.corpRegNumber,
        corpTel: values.corpPhone ?? "",
        corpFax: values.corpFax ?? "",
        corpAddr: values.corpAddress ?? "",
        corpAddrDetail: values.corpAddressDetail ?? "",
        corpZipCode: values.corpZonecode ?? "",
      };
      formData.append("corpInfo", new Blob([JSON.stringify(corpInfo)], { type: "application/json" }));
      if (bizFile) formData.append("bizFile", bizFile);
      const { data } = await apiClient.axios.post("/api/users/upgrade-to-corporate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onSuccess: async (res: any) => {
      setToken(res.accessToken);
      setRefreshToken(res.refreshToken);
      // user 직접 갱신 (null 거치지 않아 ProtectedLayout 재조회 race 방지 → 로그아웃 사고 차단)
      try {
        const me = await commAPI(apiClient).getUserInfo();
        if (me?.data) setUser(me.data);
      } catch { /* ignore */ }
      queryClient.clear();
      openAlert({ message: "사업자 전환이 완료되었습니다." });
      handleClose();
      navigate("/dashboard");
    },
  });

  const handleClose = () => {
    form.reset();
    setBizFile(null);
    onOpenChange(false);
  };

  const handleSubmit = form.handleSubmit((values) => {
    if (!bizFile) {
      form.setError("corpPaperUrl", { message: "사업자등록증을 첨부해주세요." });
      return;
    }
    upgradeMutation.mutate(values, {
      onError: (err: any) => {
        form.setError("corpName", { message: err?.response?.data?.message ?? "사업자 전환에 실패했습니다." });
      },
    });
  });

  return (
    <FormProvider {...form}>
      <FormDialog
        open={open}
        onOpenChange={(o) => (!o ? handleClose() : onOpenChange(o))}
        title="사업자 전환"
        onSubmit={handleSubmit}
        submitText="전환"
        className="max-w-[640px] max-h-[90vh] flex flex-col"
      >
        <div className="-mx-2 flex max-h-[calc(90vh-180px)] flex-col gap-3 overflow-y-auto px-2 py-2">
          <p className="text-text-200 text-xs">
            ※ 개인회원 사무소가 사업자 사무소로 전환됩니다. 사무소번호·초대코드는 유지되며 사업자 인증만 추가됩니다.
          </p>
          {/* 회원가입 사업자 폼 재사용 — 디자인/검증/입력 제어 100% 동일 */}
          <CorporationForm onFileSelect={setBizFile} />
        </div>
      </FormDialog>
    </FormProvider>
  );
};

export default UpgradeToCorporateModal;
