import { z } from 'zod'

export const PwFindSchema = z.object({
  email: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  name: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  phone: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
})

export type PwFindSchemaType = z.infer<typeof PwFindSchema>
