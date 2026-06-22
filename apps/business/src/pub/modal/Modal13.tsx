import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormDialog, RHF, Separator } from "@repo/ui";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import NationCombo from "pub/NationCombo";
import CostCenterCombo from "pub/CostCenterCombo";
import InvestNationCombo from "pub/InvestNationCombo";
import React from "react";

type ModalProps = {
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (rtnData: any) => void;
};

const TestSchema = z.object({
  val1: z.string().default(""),
  val2: z.string().min(1, { message: "sdf" }).default(""),
  val3: z.string().default(""),
});

type TestInput = z.input<typeof TestSchema>;
type TestOutput = z.input<typeof TestSchema>;

export const Modal13 = ({ title, open, onOpenChange, onSuccess }: ModalProps) => {
  const [count, setCount] = React.useState(0);
  console.log("dddd");

  const testHandler = () => {
    console.log("33333333333333333");
  };
  return (
    <FormDialog
      title={title}
      // onSubmit={form.handleSubmit(onSubmit)}
      open={open}
      onOpenChange={onOpenChange}
      submitText="저장"
      className="max-w-140!"
      bodyFull
    >
      <form className="min-w-0 space-y-2">
        <TestComp onClick={testHandler} />
        <Button onClick={() => setCount(count + 1)}>카운트 증가</Button>;
      </form>
    </FormDialog>
  );
};

const TestComp = ({ onClick }: { onClick: any }) => {
  console.log("자식 렌더링::::");
  return <Button onClick={onClick}>버튼</Button>;
};
