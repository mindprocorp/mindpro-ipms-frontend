import { z } from "zod";

export const LoginSchema = z.object({
  userId: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .default(""),
  userPw: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .default(""),
});

// export const LoginSchema = z.object({
//   userId: z
//     .email({
//       message: "유효한 이메일 주소를 입력해주세요.",
//     })
//     .default(""),
//   userPw: z
//     .string()
//     .min(8, "8자 이상 입력")
//     .regex(/[A-Z]/, "대문자 1개 이상 포함")
//     .regex(/[!@#$%^&*()[\]{};:'",.<>/?\\|`~_\-+=]/, "특수문자 1개 이상 포함")
//     .default(""),
// });

// export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type LoginFormInput = z.input<typeof LoginSchema>;
export type LoginFormOutput = z.output<typeof LoginSchema>;
