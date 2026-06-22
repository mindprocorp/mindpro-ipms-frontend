import { type CustomerFormInput } from "@shared/schema/customer/customerSchema.ts";
import { Button, CustomTooltip, FlexBox, Icons, RHF, useDaumPostcode } from "@repo/ui";
import { BoxTitle, FormUnitBox, UnitInnerBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";

const AddrInfo = () => {
  const { control, setValue, getValues } = useFormContext<CustomerFormInput>();

  // 출원주소와 동일 체크 시 복사
  const contactSameAsApp = useWatch({ control, name: "contactSameAsApp" as any });
  useEffect(() => {
    if (contactSameAsApp === "Y") {
      const v = getValues() as any;
      setValue("contactAddress" as any, v.appAddress || "");
      setValue("contactAddrDetail" as any, v.appAddrDetail || "");
      setValue("contactTel" as any, v.appTel || "");
      setValue("contactFax" as any, v.appFax || "");
    } else if (contactSameAsApp === "N") {
      setValue("contactAddress" as any, "");
      setValue("contactAddrDetail" as any, "");
      setValue("contactTel" as any, "");
      setValue("contactFax" as any, "");
    }
  }, [contactSameAsApp]);

  // 출원주소 다음 주소검색
  const appPostcode = useDaumPostcode({
    onComplete: (data) => {
      const addr = `${data.address}${data.buildingName ? ` (${data.buildingName})` : ""}`;
      setValue("appAddress", addr);
    },
  });

  // 연락주소 다음 주소검색
  const contactPostcode = useDaumPostcode({
    onComplete: (data) => {
      const addr = `${data.address}${data.buildingName ? ` (${data.buildingName})` : ""}`;
      setValue("contactAddress", addr);
    },
  });

  // 기타주소 다음 주소검색
  const etcPostcode = useDaumPostcode({
    onComplete: (data) => {
      const addr = `${data.address}${data.buildingName ? ` (${data.buildingName})` : ""}`;
      setValue("etcAddress", addr);
    },
  });

  // 외국주소 다음 주소검색
  const foreignPostcode = useDaumPostcode({
    onComplete: (data) => {
      const addr = `${data.address}${data.buildingName ? ` (${data.buildingName})` : ""}`;
      setValue("overseaAddress", addr);
    },
  });

  return (
    <FormUnitBox vertical title="주소정보">
      {/* 출원주소 */}
      <UnitInnerBox>
        <BoxTitle title="출원주소" />
        <RHF.Input
          control={control}
          name="appAddress"
          label="주소"
          readOnly
          actions={
            <CustomTooltip message="주소검색">
              <Button className="w-5" onClick={() => appPostcode.open()} disabled={!appPostcode.isReady}>
                <Icons.Search className="size-3" />
              </Button>
            </CustomTooltip>
          }
        />
        <RHF.Input control={control} name="appAddrDetail" placeholder="상세주소" noSpace={false} />
        <RHF.FormField gap={2}>
          <RHF.Input control={control} name="appTel" label="전화" telOnly />
          <RHF.Input control={control} name="appFax" label="팩스" telOnly />
        </RHF.FormField>
      </UnitInnerBox>

      {/* 연락주소 */}
      <UnitInnerBox>
        <FlexBox className="justify-between">
          <BoxTitle title="연락주소" />
          <RHF.FormCheckbox
            control={control}
            name="contactSameAsApp"
            label="출원주소와 동일"
            outputFormat={["Y", "N"]}
            size="sm"
            height={7}
          />
        </FlexBox>
        <RHF.Input
          control={control}
          name="contactAddress"
          label="주소"
          readOnly
          actions={
            <CustomTooltip message="주소검색">
              <Button className="w-5" onClick={() => contactPostcode.open()} disabled={!contactPostcode.isReady}>
                <Icons.Search className="size-3" />
              </Button>
            </CustomTooltip>
          }
        />
        <RHF.Input control={control} name="contactAddrDetail" placeholder="상세주소" noSpace={false} />
        <RHF.FormField gap={2}>
          <RHF.Input control={control} name="contactTel" label="전화" telOnly />
          <RHF.Input control={control} name="contactFax" label="팩스" telOnly />
        </RHF.FormField>
      </UnitInnerBox>

      {/* 기타주소 */}
      <UnitInnerBox>
        <BoxTitle title="기타주소" />
        <RHF.Input
          control={control}
          name="etcAddress"
          label="주소"
          readOnly
          actions={
            <CustomTooltip message="주소검색">
              <Button className="w-5" onClick={() => etcPostcode.open()} disabled={!etcPostcode.isReady}>
                <Icons.Search className="size-3" />
              </Button>
            </CustomTooltip>
          }
        />
        <RHF.Input control={control} name="etcAddrDetail" placeholder="상세주소" noSpace={false} />
        <RHF.FormField gap={2}>
          <RHF.Input control={control} name="etcTel" label="전화" telOnly />
          <RHF.Input control={control} name="etcFax" label="팩스" telOnly />
        </RHF.FormField>
      </UnitInnerBox>

      {/* 외국주소 */}
      <UnitInnerBox>
        <BoxTitle title="외국주소" />
        <RHF.Input
          control={control}
          name="overseaAddress"
          label="주소"
          readOnly
          actions={
            <CustomTooltip message="주소검색">
              <Button className="w-5" onClick={() => foreignPostcode.open()} disabled={!foreignPostcode.isReady}>
                <Icons.Search className="size-3" />
              </Button>
            </CustomTooltip>
          }
        />
        <RHF.Input control={control} name="overseaAddrDetail" placeholder="상세주소" noSpace={false} />
        <RHF.FormField gap={2}>
          <RHF.Input control={control} name="overseaTel" label="전화" telOnly />
          <RHF.Input control={control} name="overseaFax" label="팩스" telOnly />
        </RHF.FormField>
      </UnitInnerBox>
    </FormUnitBox>
  );
};

export default AddrInfo;
