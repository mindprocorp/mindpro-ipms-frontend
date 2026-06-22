import { z } from 'zod'

const JoinBaseFields = z.object({
  name: z.string().min(2, { message: '성명을 입력해주세요.' }).regex(/^[가-힣a-zA-Z]+$/, { message: '한글 또는 영문만 입력해주세요.' }),
  email: z.string().email({ message: '이메일 형식이 올바르지 않습니다.' }),
  password: z
    .string()
    .min(8, { message: '비밀번호는 8자리 이상이어야 합니다.' })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/, {
      message: '영문, 숫자, 특수문자를 포함해야 합니다.',
    }),
  confirmPassword: z.string().min(1, { message: '비밀번호 재확인을 입력해주세요.' }),
  phone: z
    .string()
    .regex(/^01(?:0\d{8}|[16-9]\d{7,8})$/, { message: '휴대폰 번호를 정확히 입력해주세요.' }), // 010 + 8자리 / 011·016·017·018·019 + 7~8자리
  phoneChecked: z.boolean().default(false),
  zonecode: z.string().optional(),
  address: z.string().trim().optional(),
  addressDetail: z.string().trim().optional(),
  companyId: z.string().optional(),
  companyName: z.string().trim().optional(),
  inviteCode: z.string().optional(),
  termsAgree: z.boolean().refine((v) => v, { message: '이용약관에 동의해주세요.' }),
  privacyPolicyAgree: z.boolean().refine((v) => v, { message: '개인정보처리방침에 동의해주세요.' }),
  marketingAgree: z.boolean().optional(),
  verificationCode: z.string().optional(),
  emailVerified: z.boolean().refine((v) => v, { message: '이메일 인증이 필요합니다.' }),
})

const CropFields = z.object({
  cropType: z.string().min(1, { message: '회사 가입구분을 선택해주세요.' }),
  corpRegNumber: z.string().regex(/^\d*$/, { message: '숫자만 입력해주세요.' }).regex(/^\d{10}$/, { message: '10자리를 입력해주세요.' }),
  corpRegVerified: z.boolean().default(false),
  ceoName: z.string().min(1, { message: '대표자명을 입력해주세요.' }).regex(/^[가-힣a-zA-Z]+$/, { message: '한글 또는 영문만 입력해주세요.' }),
  corpName: z.string().trim().min(1, { message: '회사명을 입력해주세요.' }),
  corpPhone: z.string().regex(/^\d*$/, { message: '숫자만 입력해주세요.' }).optional(),
  corpFax: z.string().regex(/^\d*$/, { message: '숫자만 입력해주세요.' }).optional(),
  corpZonecode: z.string().optional(),
  corpAddress: z.string().trim().optional(),
  corpAddressDetail: z.string().trim().optional(),
  corpPaperUrl: z.string().min(1, { message: '사업자등록증을 첨부해주세요.' }),
})

const UserSchema = JoinBaseFields.extend({
  role: z.literal('ROLE_USER'),
})

const CropUserSchema = JoinBaseFields.extend({
  role: z.literal('ROLE_CROP'),
}).extend(CropFields.shape)

const JoinSchemaRaw = z.discriminatedUnion('role', [UserSchema, CropUserSchema])

export const JoinSchema = JoinSchemaRaw.superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '비밀번호가 일치하지 않습니다.',
      path: ['confirmPassword'],
    })
  }
  if (!data.phoneChecked) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '이미 사용중인 번호입니다.',
      path: ['phone'],
    })
  }
  if (data.role === 'ROLE_CROP' && !data.corpRegVerified) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '사업자등록번호 검증이 필요합니다.',
      path: ['corpRegNumber'],
    })
  }
})

export type JoinSchemaType = z.infer<typeof JoinSchemaRaw>
