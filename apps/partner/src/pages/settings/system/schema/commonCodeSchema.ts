import z from "zod";

export const groupFormSchema = z.object({
  searchKeyword: z.string(),
  grpCd: z.string(),
  cdNm: z.string(),
  useYn: z.string(),
  delYn: z.string(),
  note: z.string(),
});

export type GroupFormInput = z.infer<typeof groupFormSchema>;
