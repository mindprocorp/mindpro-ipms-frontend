import { DomesticSchema, defaultValues } from "./apps/partner/src/shared/schema/domestic/domesticSchema.ts";

const result = DomesticSchema.safeParse(defaultValues);
console.log("Success:", result.success);
if (!result.success) {
  console.log("Errors:", JSON.stringify(result.error.issues, null, 2));
} else {
  console.log("Data:", JSON.stringify(result.data, null, 2));
}
