import { Button, Icons, RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext } from "react-hook-form";

const DesignatNation = () => {
  const { control } = useFormContext();
  return (
    <FormUnitBox fullsize title="사후 지정국가">
      <RHF.FormTextarea
        control={control}
        name="testVal"
        actions={
          <div className="flex flex-col gap-1">
            <Button className="h-6 w-6" variant="blue">
              <Icons.Search className="size-3" />
            </Button>
            <Button className="h-6 w-6">
              <Icons.PenLine className="size-3" />
            </Button>
          </div>
        }
      />
    </FormUnitBox>
  );
};

export default DesignatNation;
