import { useFormContext, useWatch } from "react-hook-form";
//Widgets
import type { JoinSchemaType } from "@widgets/auth/joinForm/schema";
import CompanySearchForm from "./CompanySearchForm";

//ui
import { FieldGroup, Button, Icons, InfoBox, RHF, AddressForm } from "@repo/ui";

// 아이콘
const { Search } = Icons;
import User from "@repo/assets/images/line/user/user-3-line.svg?react";
import { useAlertStore } from "@shared/store/useAlertStore";
import PasswordChangeModal from "@widgets/auth/joinForm/ui/PasswordChangeModal";
import { useState } from "react";

type IndividualFormProps = {
  mode?: "join" | "modify"; // join: 회원가입, modify: 정보수정
};

const IndividualForm = ({ mode = "join" }: IndividualFormProps) => {
  const { control, setValue } = useFormContext<JoinSchemaType>();
  const { openAlert } = useAlertStore();
  const [open, setOpen] = useState<boolean>(false);

  const role = useWatch({ control, name: "role" });
  const isJoin = mode === "join";
  const isModify = mode === "modify";
  const isIndividual = role === "ROLE_USER";

  return (
    <FieldGroup>
      <div className="flex items-center gap-2 text-2xl font-bold">
        <User className="size-8" />
        가입자정보
      </div>
      <RHF.FormField>
        <RHF.Input control={control} name="name" label="성명" />
        <RHF.Input control={control} name="phone" label="전화번호" />
      </RHF.FormField>

      <RHF.FormField>
        <RHF.Input
          control={control}
          name="email"
          label="이메일"
          actions={
            <Button variant="primary" className="w-28">
              중복확인
            </Button>
          }
        />
      </RHF.FormField>

      {/* 회원가입: 비밀번호 입력 */}
      {isJoin && (
        <RHF.FormField desc="비밀번호는 영문 대/소문자 특수문자를 포함한 8자리 이상">
          <RHF.Input control={control} name="password" label="비밀번호" type="password" />
          <RHF.Input
            control={control}
            name="confirmPassword"
            label="비밀번호 재확인"
            type="password"
          />
        </RHF.FormField>
      )}

      {/* 정보수정: 비밀번호 변경 버튼 */}
      {isModify && (
        <>
          <RHF.FormField label="비밀번호">
            <Button variant="outline" className="w-full" onClick={() => setOpen(true)}>
              비밀번호 변경
            </Button>
          </RHF.FormField>
          <PasswordChangeModal open={open} onOpenChange={setOpen} />
        </>
      )}

      <AddressForm setValue={setValue} addressFieldName="address" detailFieldName="addressDetail" zonecodeFieldName="zonecode" />

      {/* 개인 회원가입: 소속회사 검색 */}
      {isJoin && isIndividual && <CompanySearchForm />}

      {/* 정보수정: 회원전환 안내 */}
      {isModify && (
        <>
          <InfoBox title="회원변경 안내" icon={Icons.Info}>
            <li>
              개인회원은 사업자(법인) 회원으로 전환이 가능하지만 사업자(법인) 회원은 개인회원으로
              전환이 불가 하므로 이점 참고하시기 바랍니다.
            </li>
          </InfoBox>

          <Button
            variant="red"
            className="w-full"
            onClick={() => {
              openAlert({
                title: "회원전환 안내",
                message: `개인회원에서 사업자(법인)으로 회원을 변경하려 합니다.
한번 사업자(법인)으로 전환하시면 개인회원으로 돌아 가실 수 없습니다.
그래도 변경 하시겠습니까?`,
                confirmText: "예 변경하겠습니다.",
                cancelText: "취소",
                onConfirm: () => {},
              });
            }}
          >
            사업자(법인) 회원으로 변경하기
          </Button>
        </>
      )}
    </FieldGroup>
  );
};

export default IndividualForm;
