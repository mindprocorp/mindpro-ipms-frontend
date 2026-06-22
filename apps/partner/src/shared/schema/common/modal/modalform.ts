import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  progressModalDefaultValues,
  type ProgressModalFormInput,
  progressModalSchema,
} from "@shared/schema/common/modal/progressModalSchema.ts";
import {
  costModalDefaultValues,
  type CostModalFormInput,
  costModalSchema,
} from "@shared/schema/common/modal/costModalSchema.ts";
import {
  gracePeriodModalDefaultValues,
  type GracePeriodModalFormInput,
  gracePeriodModalSchema,
} from "@shared/schema/common/modal/gracePeriodModalSchema.ts";
import {
  preferenceModalDefaultValues,
  type PreferenceModalFormInput,
  preferenceModalSchema,
} from "@shared/schema/common/modal/preferenceModalSchema.ts";
import {
  memoModalDefaultValues,
  type MemoModalFormInput,
  memoModalSchema,
} from "@shared/schema/common/modal/memoModalSchema.ts";
import {
  rndModalDefaultValues,
  type RndModalFormInput,
  rndModalSchema,
} from "@shared/schema/common/modal/rndModalSchema.ts";
import {
  fileListModalDefaultValues,
  type FileListModalFormInput,
  fileListModalSchema,
} from "@shared/schema/common/modal/fileListModalSchema.ts";
import {
  renewalModalDefaultValues,
  type RenewalModalFormInput,
  renewalModalSchema,
} from "@shared/schema/common/modal/renewalModalSchema.ts";
import {
  productModalDefaultValues,
  type ProductModalFormInput,
  productModalSchema,
} from "@shared/schema/common/modal/productModalSchema.ts";
import {
  type DistributeFormInput,
  distributeModalDefaultValues,
  DistributeSchema,
} from "@shared/schema/bill/modal/distributeSchema.ts";
import {
  idsModalDefaultValues,
  type IdsModalFormInput,
  idsModalSchema,
} from "@shared/schema/common/modal/idsModalSchema.ts";
import {
  requiredDocsModalDefaultValues,
  type RequiredDocsModalFormInput,
  requiredDocsModalSchema,
} from "@shared/schema/common/modal/requiredDocsModalSchema.ts";
import {
  maintenanceModalDefaultValues,
  type MaintenanceModalFormInput,
  maintenanceModalSchema,
} from "@shared/schema/common/modal/maintenanceModalSchema.ts";

export const useProgressModalForm = () => {
  return useForm<ProgressModalFormInput>({
    resolver: zodResolver(progressModalSchema),
    defaultValues: progressModalDefaultValues,
  });
};

// 비용 (연차마감)
export const useCostModalForm = () => {
  return useForm<CostModalFormInput>({
    resolver: zodResolver(costModalSchema),
    defaultValues: costModalDefaultValues,
  });
};

// 공지예외
export const useGracePeriodModalForm = () => {
  return useForm<GracePeriodModalFormInput>({
    resolver: zodResolver(gracePeriodModalSchema),
    defaultValues: gracePeriodModalDefaultValues,
  });
};

// 공지예외
export const usePreferenceModalForm = () => {
  return useForm<PreferenceModalFormInput>({
    resolver: zodResolver(preferenceModalSchema),
    defaultValues: preferenceModalDefaultValues,
  });
};
// 메모
export const useMemoModalForm = () => {
  return useForm<MemoModalFormInput>({
    resolver: zodResolver(memoModalSchema),
    defaultValues: memoModalDefaultValues,
  });
};
// 연구과제
export const useRndModalForm = () => {
  return useForm<RndModalFormInput>({
    resolver: zodResolver(rndModalSchema),
    defaultValues: rndModalDefaultValues,
  });
};

// 전자포대
export const useFileListModalForm = () => {
  return useForm<FileListModalFormInput>({
    resolver: zodResolver(fileListModalSchema),
    defaultValues: fileListModalDefaultValues,
  });
};

// 갱신관리
export const useRenewalListModalForm = () => {
  return useForm<RenewalModalFormInput>({
    resolver: zodResolver(renewalModalSchema),
    defaultValues: renewalModalDefaultValues,
  });
};

// 지정상품
export const useProductListModalForm = () => {
  return useForm<ProductModalFormInput>({
    resolver: zodResolver(productModalSchema),
    defaultValues: productModalDefaultValues,
  });
};

// 실적분배
export const useDistibuteModalForm = () => {
  return useForm<DistributeFormInput>({
    resolver: zodResolver(DistributeSchema),
    defaultValues: distributeModalDefaultValues,
  });
};

// IDS
export const useIdsModalForm = () => {
  return useForm<IdsModalFormInput>({
    resolver: zodResolver(idsModalSchema),
    defaultValues: idsModalDefaultValues,
  });
};

// 구비서류
export const useRequiredDocsModalForm = () => {
  return useForm<RequiredDocsModalFormInput>({
    resolver: zodResolver(requiredDocsModalSchema),
    defaultValues: requiredDocsModalDefaultValues,
  });
};

// 유지비
export const useMaintenancesModalForm = () => {
  return useForm<MaintenanceModalFormInput>({
    resolver: zodResolver(maintenanceModalSchema),
    defaultValues: maintenanceModalDefaultValues,
  });
};