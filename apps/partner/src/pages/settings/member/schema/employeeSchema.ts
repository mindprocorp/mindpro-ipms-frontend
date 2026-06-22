import z from "zod";

export const employeeSchema = z.object({
  userNameKo: z.string(),
  userEmail: z.string(),
  userMobileNo: z.string(),
  deptName: z.string(),
  userPosition: z.string(),
  positionCode: z.string(),
  jobGradeCode: z.string(),
  workCode: z.string(),
  userAddr: z.string(),
  userAddrDetail: z.string(),
  userTypeCode: z.string().optional(),
  workStatusCode: z.string().optional(),
  employStatusCode: z.string().optional(),
  acctStatusCode: z.string().optional(),
  roleSeq: z.string().optional(),
});

export type EmployeeFormInput = z.infer<typeof employeeSchema>;
