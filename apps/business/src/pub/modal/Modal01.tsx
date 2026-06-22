import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormDialog, Icons, RHF, Separator } from "@repo/ui";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

type ModalProps = {
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (rtnData: any) => void;
};

const TestSchema = z.object({
  val1: z.string().default(""),
  val2: z.string().default(""),
  val3: z.string().default(""),
});

type TestInput = z.input<typeof TestSchema>;
type TestOutput = z.input<typeof TestSchema>;

export const Modal01 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
  const form = useForm<TestInput>({
    resolver: zodResolver(TestSchema),
    defaultValues: TestSchema.parse({}),
  });

  const onSubmit = (values: TestInput) => {
    const resultValue: TestOutput = TestSchema.parse(values);
    form.reset();
    onOpenChange(false);
    onSuccess?.(resultValue);
  };

  return (
    <FormProvider {...form}>
      <FormDialog
        title={title}
        onSubmit={form.handleSubmit(onSubmit)}
        open={open}
        onOpenChange={onOpenChange}
        className="max-w-100!"
        bodyFull
      >
        <form className="border-border-100 min-w-0 space-y-4 border-y p-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-text-100 pb-1 text-xs font-medium">국내</h2>
            <div className="flex justify-between [&>div]:gap-2">
              <span className="text-(length:--label-default)">특허</span>
              <div className="flex">
                <Button size="h28" className="w-7">
                  <Icons.Minus className="size-2.5" />
                </Button>
                <RHF.Input
                  type="number"
                  control={form.control}
                  size="h28"
                  name="val1"
                  //   label="특허"
                  orientation="horizontal"
                  className="[&_input]:appearance:textfield w-10 [&_input]:[&::-webkit-inner-spin-button]:appearance-none [&_input]:[&::-webkit-outer-spin-button]:appearance-none"
                  align="center"
                />
                <Button size="h28" className="w-7">
                  <Icons.Plus className="size-2.5" />
                </Button>
              </div>
            </div>

            <div className="flex justify-between [&>div]:gap-2">
              <span className="text-(length:--label-default)">실용신안</span>
              <div className="flex">
                <Button size="h28" className="w-7">
                  <Icons.Minus className="size-2.5" />
                </Button>
                <RHF.Input
                  type="number"
                  control={form.control}
                  size="h28"
                  name="val1"
                  //   label="특허"
                  orientation="horizontal"
                  className="[&_input]:appearance:textfield w-10 [&_input]:[&::-webkit-inner-spin-button]:appearance-none [&_input]:[&::-webkit-outer-spin-button]:appearance-none"
                  align="center"
                />
                <Button size="h28" className="w-7">
                  <Icons.Plus className="size-2.5" />
                </Button>
              </div>
            </div>

            <div className="flex justify-between [&>div]:gap-2">
              <span className="text-(length:--label-default)">상표</span>
              <div className="flex">
                <Button size="h28" className="w-7">
                  <Icons.Minus className="size-2.5" />
                </Button>
                <RHF.Input
                  type="number"
                  control={form.control}
                  size="h28"
                  name="val1"
                  //   label="특허"
                  orientation="horizontal"
                  className="[&_input]:appearance:textfield w-10 [&_input]:[&::-webkit-inner-spin-button]:appearance-none [&_input]:[&::-webkit-outer-spin-button]:appearance-none"
                  align="center"
                />
                <Button size="h28" className="w-7">
                  <Icons.Plus className="size-2.5" />
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-6 border-t" />

          <div className="flex flex-col gap-1">
            <h2 className="text-text-100 pb-1 text-xs font-medium">해외</h2>
            <div className="flex justify-between [&>div]:gap-2">
              <span className="text-(length:--label-default)">특허</span>
              <div className="flex">
                <Button size="h28" className="w-7">
                  <Icons.Minus className="size-2.5" />
                </Button>
                <RHF.Input
                  type="number"
                  control={form.control}
                  size="h28"
                  name="val1"
                  //   label="특허"
                  orientation="horizontal"
                  className="[&_input]:appearance:textfield w-10 [&_input]:[&::-webkit-inner-spin-button]:appearance-none [&_input]:[&::-webkit-outer-spin-button]:appearance-none"
                  align="center"
                />
                <Button size="h28" className="w-7">
                  <Icons.Plus className="size-2.5" />
                </Button>
              </div>
            </div>

            <div className="flex justify-between [&>div]:gap-2">
              <span className="text-(length:--label-default)">실용신안</span>
              <div className="flex">
                <Button size="h28" className="w-7">
                  <Icons.Minus className="size-2.5" />
                </Button>
                <RHF.Input
                  type="number"
                  control={form.control}
                  size="h28"
                  name="val1"
                  //   label="특허"
                  orientation="horizontal"
                  className="[&_input]:appearance:textfield w-10 [&_input]:[&::-webkit-inner-spin-button]:appearance-none [&_input]:[&::-webkit-outer-spin-button]:appearance-none"
                  align="center"
                />
                <Button size="h28" className="w-7">
                  <Icons.Plus className="size-2.5" />
                </Button>
              </div>
            </div>

            <div className="flex justify-between [&>div]:gap-2">
              <span className="text-(length:--label-default)">상표</span>
              <div className="flex">
                <Button size="h28" className="w-7">
                  <Icons.Minus className="size-2.5" />
                </Button>
                <RHF.Input
                  type="number"
                  control={form.control}
                  size="h28"
                  name="val1"
                  //   label="특허"
                  orientation="horizontal"
                  className="[&_input]:appearance:textfield w-10 [&_input]:[&::-webkit-inner-spin-button]:appearance-none [&_input]:[&::-webkit-outer-spin-button]:appearance-none"
                  align="center"
                />
                <Button size="h28" className="w-7">
                  <Icons.Plus className="size-2.5" />
                </Button>
              </div>
            </div>
          </div>
        </form>
      </FormDialog>
    </FormProvider>
  );
};

export default Modal01;
