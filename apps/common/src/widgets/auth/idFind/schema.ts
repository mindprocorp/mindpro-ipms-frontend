import { z } from 'zod'

// 아이디찾기
export const IdFindSchema = z.object({
  name: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  phone: z.string().regex(/^\d+$/, { message: '숫자만 입력' }).min(2, {
    message: '필수입력',
  }),
})

export type IdFindSchemaType = z.infer<typeof IdFindSchema>
