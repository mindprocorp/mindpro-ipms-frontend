import { z } from "zod";

export const dispatchSchema = z.object({
  dispatchSeq: z.string().optional().nullable(),
  category: z.string({ required_error: "구분을 선택해주세요." }).min(1, "구분을 선택해주세요.").max(50, "최대 50자까지 입력 가능합니다"),
  docType: z.string({ required_error: "종류를 입력해주세요." }).min(1, "종류를 입력해주세요.").max(50, "최대 50자까지 입력 가능합니다"),
  dispatchDate: z.string({ required_error: "일자를 선택해주세요." }).min(1, "일자를 선택해주세요."),
  client: z.string({ required_error: "거래처를 입력해주세요." }).min(1, "거래처를 입력해주세요.").max(200, "최대 200자까지 입력 가능합니다"),
  manager: z.string({ required_error: "담당자를 입력해주세요." }).min(1, "담당자를 입력해주세요.").max(100, "최대 100자까지 입력 가능합니다"),
  docContent: z.string({ required_error: "상세 내용을 입력해주세요." }).min(1, "상세 내용을 입력해주세요."),
  method: z.string({ required_error: "전달방법을 입력해주세요." }).min(1, "전달방법을 입력해주세요.").max(50, "최대 50자까지 입력 가능합니다"),
  sendDate: z.string({ required_error: "발송일을 선택해주세요." }).min(1, "발송일을 선택해주세요."),
  regNo: z.string({ required_error: "등기번호를 입력해주세요." }).min(1, "등기번호를 입력해주세요.").max(100, "최대 100자까지 입력 가능합니다"),
  ackYn: z.string().default("N"),
  postAddr: z.string({ required_error: "우편주소를 입력해주세요." }).min(1, "우편주소를 입력해주세요.").max(500, "최대 500자까지 입력 가능합니다"),
  note: z.string({ required_error: "비고를 입력해주세요." }).min(1, "비고를 입력해주세요.").max(1000, "최대 1000자까지 입력 가능합니다"),
});

export type DispatchSchemaType = z.infer<typeof dispatchSchema>;
