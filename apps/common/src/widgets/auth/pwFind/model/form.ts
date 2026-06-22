import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PwFindSchema, type PwFindSchemaType } from '../schema'

const defaultValues = {
  email: '',
  name: '',
  phone: '',
}

export const usePwFindForm = () => {
  return useForm<PwFindSchemaType>({
    resolver: zodResolver(PwFindSchema),
    defaultValues,
  })
}
