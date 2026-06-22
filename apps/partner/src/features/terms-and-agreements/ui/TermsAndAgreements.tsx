import { useState } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import {
  Checkbox,
  cn,
  FlexBox,
  Label,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@repo/ui'

type TermsAndAgreementsProps = {
  className?: string
}

const TERMS_CONTENT = {
  termsAgree: {
    title: '이용약관',
    content: `제1조 (목적)
이 약관은 주식회사 마인드프로(이하 "회사")가 제공하는 IPMS 지식재산 관리 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "서비스"란 회사가 제공하는 지식재산 관리와 관련된 모든 온라인 서비스를 말합니다.
2. "회원"이란 이 약관에 동의하고 회사와 서비스 이용 계약을 체결한 자를 말합니다.
3. "아이디(ID)"란 회원의 식별 및 서비스 이용을 위하여 회원이 설정하고 회사가 승인한 이메일 주소를 말합니다.

제3조 (약관의 효력 및 변경)
1. 이 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.
2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 변경할 수 있습니다.

제4조 (서비스의 제공)
1. 회사는 다음과 같은 서비스를 제공합니다.
  - 지식재산 출원/등록 관리
  - 기한 관리 및 알림
  - 비용 관리
  - 고객 관리
  - 기타 회사가 정하는 서비스

제5조 (회원의 의무)
1. 회원은 서비스 이용 시 관련 법령, 약관, 이용안내 등을 준수하여야 합니다.
2. 회원은 자신의 아이디 및 비밀번호를 관리할 책임이 있습니다.
3. 회원은 타인의 개인정보를 부정하게 사용하여서는 안 됩니다.`,
  },
  privacyPolicyAgree: {
    title: '개인정보처리방침',
    content: `주식회사 마인드프로(이하 "회사")는 개인정보 보호법에 따라 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보 처리방침을 수립·공개합니다.

1. 수집하는 개인정보 항목
  - 필수항목: 이메일, 비밀번호, 이름, 휴대폰 번호
  - 선택항목: 주소, 소속회사, 사업자등록번호

2. 개인정보의 수집 및 이용 목적
  - 회원 가입 및 관리: 본인 확인, 서비스 부정 이용 방지
  - 서비스 제공: 지식재산 관리 서비스 제공
  - 고객 상담 및 불만 처리

3. 개인정보의 보유 및 이용 기간
  - 회원 탈퇴 시까지 (단, 관련 법령에 따라 보존할 필요가 있는 경우 해당 기간까지)
  - 전자상거래법에 따른 계약 또는 청약 철회 기록: 5년
  - 로그인 기록: 3개월

4. 개인정보의 파기
  - 보유 기간이 경과한 개인정보는 지체 없이 파기합니다.
  - 전자적 파일 형태: 복구 불가능한 방법으로 영구 삭제
  - 기타 기록물: 파쇄 또는 소각

5. 개인정보 보호 책임자
  - 직위: 대표이사
  - 연락처: info@mindpro.co.kr`,
  },
  marketingAgree: {
    title: '마케팅 정보 수신 동의',
    content: `주식회사 마인드프로는 회원에게 다양한 서비스 정보 및 혜택을 제공하기 위해 아래와 같이 마케팅 정보를 수신할 수 있습니다.

1. 수신 항목
  - 신규 서비스 안내
  - 이벤트 및 프로모션 정보
  - 서비스 업데이트 안내
  - 지식재산 관련 뉴스레터

2. 수신 방법
  - 이메일, SMS, 앱 푸시 알림

3. 수신 동의 철회
  - 회원은 언제든지 마케팅 정보 수신을 거부할 수 있습니다.
  - 설정 > 알림 설정에서 변경하거나, 수신된 메시지 내 수신 거부 링크를 통해 철회할 수 있습니다.

※ 마케팅 정보 수신 동의는 선택 사항이며, 동의하지 않으셔도 서비스 이용에 제한이 없습니다.`,
  },
} as const

const TermsAndAgreements = ({ className }: TermsAndAgreementsProps) => {
  const { control, setValue } = useFormContext()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<keyof typeof TERMS_CONTENT>('termsAgree')

  const [termsAgree, privacyPolicyAgree, marketingAgree] = useWatch({
    control,
    name: ['termsAgree', 'privacyPolicyAgree', 'marketingAgree'],
  })

  const allChecked = termsAgree === true && privacyPolicyAgree === true && marketingAgree === true

  const handleAllCheck = (checked: boolean) => {
    setValue('termsAgree', checked)
    setValue('privacyPolicyAgree', checked)
    setValue('marketingAgree', checked)
  }

  const handleView = (type: keyof typeof TERMS_CONTENT) => {
    setModalType(type)
    setModalOpen(true)
  }

  return (
    <>
      <div className={cn('space-y-1', className)}>
        <FlexBox className="items-center gap-2 py-2">
          <Checkbox
            id="allAgree"
            className="data-[state=checked]:bg-primary-btn data-[state=checked]:border-primary-btn"
            checked={allChecked}
            onCheckedChange={(checked) => handleAllCheck(checked === true)}
          />
          <Label htmlFor="allAgree" className="text-sm font-medium cursor-pointer">
            전체 동의
          </Label>
        </FlexBox>

        <div className="space-y-1">
          <AgreeRow control={control} name="termsAgree" label="[필수] 이용약관에 동의합니다." onView={() => handleView('termsAgree')} />
          <AgreeRow control={control} name="privacyPolicyAgree" label="[필수] 개인정보처리방침에 동의합니다." onView={() => handleView('privacyPolicyAgree')} />
          <AgreeRow control={control} name="marketingAgree" label="[선택] 마케팅 정보 수신에 동의합니다." onView={() => handleView('marketingAgree')} />
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg max-h-[70vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{TERMS_CONTENT[modalType].title}</DialogTitle>
            <DialogDescription>※ 본 약관은 임시로 생성된 내용입니다.</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <pre className="text-text-200 whitespace-pre-wrap text-xs leading-relaxed p-4 bg-muted rounded-md">
              {TERMS_CONTENT[modalType].content}
            </pre>
          </div>
          <DialogFooter>
            <Button variant="primary" size="h44" onClick={() => setModalOpen(false)}>
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

type AgreeRowProps = {
  control: any
  name: string
  label: string
  onView: () => void
}

const AgreeRow = ({ control, name, label, onView }: AgreeRowProps) => {
  return (
    <FlexBox className="justify-between items-center py-0.5">
      <FlexBox className="items-center gap-2">
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Checkbox
              id={name}
              className="data-[state=checked]:bg-primary-btn data-[state=checked]:border-primary-btn"
              checked={field.value ?? false}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
          )}
        />
        <Label htmlFor={name} className="text-text-200 text-sm cursor-pointer">
          {label}
        </Label>
      </FlexBox>
      <Button variant="link" size="h24" type="button" onClick={onView}>
        보기
      </Button>
    </FlexBox>
  )
}

export default TermsAndAgreements
