import { Button, Icons, RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox.tsx";
import { useFormContext } from "react-hook-form";

const RegiNation = () => {
  const { control } = useFormContext<any>();
  return (
    <FormUnitBox fullsize title="등록국가">
      <RHF.FormTextarea
        control={control}
        name="testVal"
        actions={
          <div className="flex flex-col gap-1">
            <Button className="h-6 w-6" variant="blue">
              <Icons.Search className="size-3" />
            </Button>
          </div>
        }
        maxLength={2000}
        placeholder="돋보기를 눌러 지정해주세요"
        readOnly
      />
    </FormUnitBox>
  );
};

export default RegiNation;
