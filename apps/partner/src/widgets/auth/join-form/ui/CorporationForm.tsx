import { useFormContext } from "react-hook-form";
import type { JoinSchemaType } from "@widgets/auth/join-form/schema";
import BusinessVerificationForm from "./BusinessVerificationForm";
import { RHF, AddressForm } from "@repo/ui";
import Corporation from "@shared/assets/hotel-line.svg?react";

type CorporationFormProps = {
  onFileSelect?: (file: File | null) => void;
};

const CorporationForm = ({ onFileSelect }: CorporationFormProps) => {
  const { control, setValue } = useFormContext<JoinSchemaType>();

  const dumpJson = [
    { label: "일반회사(법인)", value: "1" },
    { label: "변리사 사무소", value: "2" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-2xl font-bold">
        <Corporation className="size-8" />
        회사 정보
      </div>

      <RHF.FormGroupField
        control={control}
        name="cropType"
        label="회사 가입구분"
        className="[&>div>div]:flex-0"
      >
        <RHF.FormRadio
          control={control}
          name="cropType"
          items={dumpJson}
          defaultValue="1"
          type="normal"
        />
      </RHF.FormGroupField>

      <div className="grid grid-cols-2 gap-3">
        <RHF.Input size="h44" control={control} name="ceoName" label="대표자명" ess noSpace />
        <RHF.Input size="h44" control={control} name="corpName" label="회사명" ess />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <RHF.Input size="h44" control={control} name="corpPhone" label="대표전화" inputMode="numeric" maxLength={11} noSpace />
        <RHF.Input size="h44" control={control} name="corpFax" label="팩스" inputMode="numeric" maxLength={11} noSpace />
      </div>

      <AddressForm
        setValue={setValue}
        addressFieldName="corpAddress"
        detailFieldName="corpAddressDetail"
        zonecodeFieldName="corpZonecode"
      />

      <BusinessVerificationForm onFileSelect={onFileSelect} />
    </div>
  );
};

export default CorporationForm;
