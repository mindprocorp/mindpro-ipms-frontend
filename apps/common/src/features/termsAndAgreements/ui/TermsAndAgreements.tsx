import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { Checkbox, cn, FlexBox, Label, Button } from '@repo/ui'

type TermsAndAgreementsProps = {
  className?: string
}

const TermsAndAgreements = ({ className }: TermsAndAgreementsProps) => {
  const { control, setValue } = useFormContext()

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

  return (
    <div className={cn('space-y-2', className)}>
      <FlexBox className="min-h-11 items-center gap-2">
        <Checkbox
          id="allAgree"
          checked={allChecked}
          onCheckedChange={(checked) => handleAllCheck(checked === true)}
        />
        <Label htmlFor="allAgree" className="text-md font-medium cursor-pointer">
          전체 동의
        </Label>
      </FlexBox>

      <div className="space-y-2">
        <AgreeRow
          control={control}
          name="termsAgree"
          label="[필수] 이용약관에 동의합니다."
        />
        <AgreeRow
          control={control}
          name="privacyPolicyAgree"
          label="[필수] 개인정보처리방침에 동의합니다."
        />
        <AgreeRow
          control={control}
          name="marketingAgree"
          label="[선택] 마케팅 정보 수신에 동의합니다."
        />
      </div>
    </div>
  )
}

type AgreeRowProps = {
  control: any
  name: string
  label: string
}

const AgreeRow = ({ control, name, label }: AgreeRowProps) => {
  return (
    <FlexBox className="justify-between items-center">
      <FlexBox className="items-center gap-2">
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Checkbox
              id={name}
              checked={field.value ?? false}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
          )}
        />
        <Label htmlFor={name} className="text-text-200 cursor-pointer">
          {label}
        </Label>
      </FlexBox>
      <Button variant="link" size="h24" type="button">
        보기
      </Button>
    </FlexBox>
  )
}

export default TermsAndAgreements
