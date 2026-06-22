import { z } from 'zod'

export const PwFindSchema = z.object({
  email: z.string().email({ message: '이메일 형식이 올바르지 않습니다.' }),
  name: z.string().min(2, {
    message: '이름은 2자 이상 입력해주세요.',
  }),
  phone: z.string().regex(/^01(?:0\d{8}|[16-9]\d{7,8})$/, {
    message: '휴대폰 번호를 정확히 입력해주세요.',
  }),
})

export type PwFindSchemaType = z.infer<typeof PwFindSchema>
