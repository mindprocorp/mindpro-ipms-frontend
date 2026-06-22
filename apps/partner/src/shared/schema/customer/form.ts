import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CustomerFormInput, CustomerSchema, defaultValues } from "@shared/schema/customer/customerSchema.ts";

export const useCustomerForm = () => {
  return useForm<CustomerFormInput>({
    resolver: zodResolver(CustomerSchema),
    defaultValues,
    mode: "all",
    reValidateMode: "onChange",
  });
};
