import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuickSearchSchema, type QuickSearchSchemaType } from "../schema";

const defaultValues = {
  searchNum: "",
  searchName: "",
  tabConditions: ["condiCount"],
  condiCount: "Y",
  condiInSearch: true,
  condiImage: "condiImage",
  testparms: "remix",
  parms: [],
} satisfies QuickSearchSchemaType;

export const useQuickSearchForm = () => {
  return useForm<QuickSearchSchemaType>({
    resolver: zodResolver(QuickSearchSchema),
    defaultValues,
  });
};
