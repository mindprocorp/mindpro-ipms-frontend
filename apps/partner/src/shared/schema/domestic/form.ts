import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type DomesticFormInput, DomesticSchema, defaultValues } from "@shared/schema/domestic/domesticSchema.ts";


export const useDomesticForm = () => {
  return useForm<DomesticFormInput>({
    resolver: zodResolver(DomesticSchema) as Resolver<DomesticFormInput>,
    defaultValues,
    mode: "onChange",
  });
};
