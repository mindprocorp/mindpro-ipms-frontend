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
  zonecode: '',
  address: '',
  addressDetail: '',
  // 소속 회사
  companyId: '',
  companyName: '',
  // 약관 동의
  termsAgree: false,
  privacyPolicyAgree: false,
  marketingAgree: false,
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
  return useForm<JoinSchemaType>({
    resolver: zodResolver(JoinSchema),
    defaultValues,
  })
}
