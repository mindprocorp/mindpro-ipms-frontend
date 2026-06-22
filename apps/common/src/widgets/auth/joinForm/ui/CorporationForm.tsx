import { useFormContext } from "react-hook-form";
//Widgets
import type { JoinSchemaType } from "@widgets/auth/joinForm/schema";
import BusinessVerificationForm from "./BusinessVerificationForm";

//ui
import { FieldGroup, RHF, AddressForm } from "@repo/ui";

import Corporation from "@repo/assets/images/line/buildings/hotel-line.svg?react";

const CorporationForm = () => {
  const { control, setValue } = useFormContext<JoinSchemaType>();

  const dumpJson = [
    { label: "일반회사(법인)", value: "1" },
    { label: "변리사 사무소", value: "2" },
  ];

  return (
    <FieldGroup>
      <div className="flex items-center gap-2 text-2xl font-bold">
        <Corporation className="size-8" />
        회사 정보
      </div>

      <RHF.FormGroupField control={control} name="cropType" label="회사 가입구분">
        <RHF.FormRadio
          control={control}
          name="cropType"
          label="개인회원"
          items={dumpJson}
          defaultValue="1"
          type="normal"
        />
      </RHF.FormGroupField>

      <RHF.FormField>
        <RHF.Input control={control} name="ceoName" label="대표자명" />
        <RHF.Input control={control} name="corpName" label="회사명" />
      </RHF.FormField>

      <RHF.FormField>
        <RHF.Input control={control} name="corpPhone" label="대표전화" />
        <RHF.Input control={control} name="corpFax" label="팩스" />
      </RHF.FormField>

      <AddressForm setValue={setValue} addressFieldName="corpAddress" detailFieldName="corpAddressDetail" zonecodeFieldName="corpZonecode" />

      <BusinessVerificationForm />

    </FieldGroup>
  );
};

export default CorporationForm;
