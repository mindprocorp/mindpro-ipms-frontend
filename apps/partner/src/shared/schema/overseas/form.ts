import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BasicSchema,
  overseasBasicDefaultValues,
  type OverseasBasicFormInput,
} from "@shared/schema/overseas/basicSchema.ts";
import DirectAppSchema, {
  overseasDirectAppDefaultValues,
  type OverseasDirectAppFormInput,
} from "@shared/schema/overseas/directAppSchema.ts";
import {
  EpSchema,
  overseasEpDefaultValues,
  type OverseasEpFormInput,
} from "@shared/schema/overseas/epSchema.ts";
import {
  overseasPctDefaultValues,
  type OverseasPctFormInput,
  PctSchema,
} from "@shared/schema/overseas/pctAppSchema.ts";
import {
  MadridSchema,
  overseasMadridDefaultValues,
  type OverseasMadridFormInput,
} from "@shared/schema/overseas/madridSchema.ts";
import {
  NationalSchema,
  overseasNationalDefaultValues,
  type OverseasNationalFormInput,
} from "@shared/schema/overseas/nationalSchema.ts";

export const useOverseasBasicForm = () => {
  return useForm<OverseasBasicFormInput>({
    resolver: zodResolver(BasicSchema),
    defaultValues: overseasBasicDefaultValues,
    mode: "onChange",
  });
};

export const useOverseasDirectAppForm = () => {
  return useForm<OverseasDirectAppFormInput>({
    resolver: zodResolver(DirectAppSchema) as Resolver<OverseasDirectAppFormInput>,
    defaultValues: overseasDirectAppDefaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });
};

export const useOverseasEpAppForm = () => {
  return useForm<OverseasEpFormInput>({
    resolver: zodResolver(EpSchema) as Resolver<OverseasEpFormInput>,
    defaultValues: overseasEpDefaultValues,
    mode: "onChange",
  });
};

export const useOverseasPctAppForm = () => {
  return useForm<OverseasPctFormInput>({
    resolver: zodResolver(PctSchema) as Resolver<OverseasPctFormInput>,
    defaultValues: overseasPctDefaultValues,
    mode: "onChange",
  });
};

export const useOverseasMadridAppForm = () => {
  return useForm<OverseasMadridFormInput>({
    resolver: zodResolver(MadridSchema) as Resolver<OverseasMadridFormInput>,
    defaultValues: overseasMadridDefaultValues,
    mode: "onChange",
  });
};

export const useOverseasNationalAppForm = () => {
  return useForm<OverseasNationalFormInput>({
    resolver: zodResolver(NationalSchema) as Resolver<OverseasNationalFormInput>,
    defaultValues: overseasNationalDefaultValues,
    mode: "onChange",
  });
};
