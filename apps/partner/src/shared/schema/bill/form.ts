import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  billDomesticDefaultValues,
  type BillDomesticFormInput,
  BillDomesticSchema,
} from "@shared/schema/bill/billDomesticSchema.ts";
import {
  billDetailModalDefaultValues,
  type BillDetailModalFormInput,
  billDetailModalSchema,
} from "@shared/schema/bill/modal/billDetailModalSchema.ts";
import {
  billDistributeModalDefaultValues,
  type BillDistributeModalFormInput,
  billDistributeModalSchema,
} from "@shared/schema/bill/modal/billDistributeModalSchema.ts";

export const useBillDomesticForm = () => {
  return useForm<BillDomesticFormInput>({
    resolver: zodResolver(BillDomesticSchema),
    defaultValues: billDomesticDefaultValues,
    mode: "onChange",
  });
};

export const useBillDetailModalForm = () => {
  return useForm<BillDetailModalFormInput>({
    resolver: zodResolver(billDetailModalSchema),
    defaultValues: billDetailModalDefaultValues,
    mode: "onChange",
  });
};

export const useBillDistributeModalForm = () => {
  return useForm<BillDistributeModalFormInput>({
    resolver: zodResolver(billDistributeModalSchema),
    defaultValues: billDistributeModalDefaultValues,
    mode: "onChange",
  });
};