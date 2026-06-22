import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IdFindSchema, type IdFindSchemaType } from '../schema'

const defaultValues = {
  name: '',
  phone: '',
}

export const useIdFindForm = () => {
  return useForm<IdFindSchemaType>({
    resolver: zodResolver(IdFindSchema),
    defaultValues,
  })
}
