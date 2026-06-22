import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormTemplateSchema, type FormTemplateInput } from "./formTemplateSchema";

/** 서식 템플릿 위자드 전용 폼 훅 */
export const useFormTemplateForm = () => {
  return useForm<FormTemplateInput>({
    resolver: zodResolver(FormTemplateSchema),
    defaultValues: FormTemplateSchema.parse({}),
  });
};
