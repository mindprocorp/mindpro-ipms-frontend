import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginFormInput } from "../schema";

// const defaultValues = {
//   userId: "",
//   userPw: "",
// };

export const useLoginForm = () => {
  return useForm<LoginFormInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: LoginSchema.parse({}),
  });
};
