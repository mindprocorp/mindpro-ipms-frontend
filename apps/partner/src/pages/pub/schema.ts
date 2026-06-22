import z from "zod";

export const TestSchema = z.object({
  testVal: z
    .string()
    .min(2, {
      message: "필수입력",
    })
    .default(""),
});

export type TestFormInput = z.input<typeof TestSchema>;
export type TestFormOutput = z.output<typeof TestSchema>;

export type TestData = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const data: TestData[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@example.com",
  },
];
