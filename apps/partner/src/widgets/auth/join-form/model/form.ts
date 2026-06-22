import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { JoinSchema, type JoinSchemaType } from '../schema'
import type { UserRole } from '@shared/providers/store/authStore'

const defaultValues = {
  role: 'ROLE_USER' as UserRole,
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  phoneChecked: true,
  zonecode: '',
  address: '',
  addressDetail: '',
  // 소속 회사
  companyId: '',
  companyName: '',
  inviteCode: '',
  // 약관 동의
  termsAgree: false,
  privacyPolicyAgree: false,
  marketingAgree: false,
  // 이메일 인증
  verificationCode: '',
  emailVerified: false,
  // 법인 정보
  cropType: '1',
  corpRegNumber: '',
  corpRegVerified: false,
  ceoName: '',
  corpName: '',
  corpPhone: '',
  corpFax: '',
  corpZonecode: '',
  corpAddress: '',
  corpAddressDetail: '',
  corpPaperUrl: '',
}

export const useJoinForm = () => {
  return useForm<JoinSchemaType, unknown, JoinSchemaType>({
    resolver: zodResolver(JoinSchema),
    defaultValues,
    mode: 'onChange',
  })
}
