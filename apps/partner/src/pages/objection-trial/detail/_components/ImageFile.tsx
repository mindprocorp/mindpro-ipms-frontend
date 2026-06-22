import { cn, Icons, Input, Label, RHF } from "@repo/ui";
import { FormUnitBox } from "@shared/ui/form-unit-box/FormUnitBox";
import { useFormContext } from "react-hook-form";

const ImageFile = () => {
  const { control } = useFormContext();
  const style = `
    bg-p-color-1 text-white flex justify-center items-center text-sm p-1.5 rounded-[4px]
    cursor-pointer hover:bg-p-color-1/90
  `;
  return (
    <FormUnitBox vertical title="대표도">
      <div className="w-full">
        <div className="border-border-100 bg-bg-100 mx-auto flex h-47.5 w-47.5 items-center justify-center overflow-hidden rounded-xl border">
          <Icons.Image className="size-12 opacity-30" />
          <img src="https://image.bugsm.co.kr/album/images/350/207811/20781121.jpg" />
        </div>
      </div>
      <Label htmlFor="picture" className={cn("[&>input]:hidden", style)}>
        <Icons.Upload className="size-4" />
        파일등록
        <Input id="picture" type="file" />
      </Label>
      <p className="text-p-color-2 text-xs">10M 이하의 gif,jpeg,png 파일만 등록가능 합니다.</p>
    </FormUnitBox>
  );
};

export default ImageFile;
