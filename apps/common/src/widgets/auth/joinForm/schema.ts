import { z } from 'zod'
import { type UserRole } from '@shared/providers/store/authStore'

// 최대 파일 크기 (예: 3MB)
const MAX_UPLOAD_SIZE = 1024 * 1024 * 3
// 허용되는 MIME 타입 목록
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/gif']

export const JoinBase = z.object({
  name: z.string().min(2, {
    message: '필수입력',
  }),
  email: z.email().min(2, {
    message: '필수입력',
  }),
  password: z.string().min(2, {
    message: '필수입력',
  }),
  confirmPassword: z.string().min(2, {
    message: '필수입력',
  }),
  phone: z.string().regex(/^\d+$/, { message: '숫자만 입력' }).min(2, {
    message: '필수입력',
  }),
  zonecode: z.string().optional(),
  address: z.string().optional(),
  addressDetail: z.string().optional(),
  // 소속 회사
  companyId: z.string().optional(),
  companyName: z.string().optional(),
  // 약관 동의
  termsAgree: z.boolean().refine((val) => val === true, {
    message: '이용약관에 동의해주세요',
  }),
  privacyPolicyAgree: z.boolean().refine((val) => val === true, {
    message: '개인정보처리방침에 동의해주세요',
  }),
  marketingAgree: z.boolean().optional(),
})

export const CropBase = z.object({
  cropType: z.string().min(1, {
    message: '필수입력',
  }),
  // 사업자등록번호 (10자리)
  corpRegNumber: z.string().regex(/^\d{10}$/, { message: '사업자등록번호 10자리를 입력해주세요' }),
  // 사업자등록번호 검증 여부
  corpRegVerified: z.boolean().refine((val) => val === true, {
    message: '사업자등록번호 검증이 필요합니다',
  }),
  ceoName: z.string().min(2, {
    message: '필수입력',
  }),
  corpName: z.string().min(2, {
    message: '필수입력',
  }),
  corpPhone: z.string().regex(/^\d+$/, { message: '숫자만 입력' }).min(2, {
    message: '필수입력',
  }),
  corpFax: z.string().optional(),
  corpZonecode: z.string().optional(),
  corpAddress: z.string().optional(),
  corpAddressDetail: z.string().optional(),
  // 사업자등록증 이미지 URL
  corpPaperUrl: z.string().optional(),
})

// export type JoinSchemaType = z.infer<typeof JoinSchema>
const UserSchema = JoinBase.extend({ role: z.literal('ROLE_USER') })
const CropUserSchema = JoinBase.extend({ role: z.literal('ROLE_CROP') }).extend(CropBase.shape)

export const JoinSchema = z.discriminatedUnion('role', [UserSchema, CropUserSchema])
export type JoinSchemaType = z.infer<typeof JoinSchema>
