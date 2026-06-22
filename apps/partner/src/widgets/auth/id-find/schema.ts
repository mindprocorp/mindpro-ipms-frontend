import { z } from 'zod'

// 아이디찾기
export const IdFindSchema = z.object({
  name: z.string().min(2, {
    message: '이름은 2자 이상 입력해주세요.',
  }),
  phone: z.string().regex(/^01(?:0\d{8}|[16-9]\d{7,8})$/, {
    message: '휴대폰 번호를 정확히 입력해주세요.',
  }),
})

export type IdFindSchemaType = z.infer<typeof IdFindSchema>
