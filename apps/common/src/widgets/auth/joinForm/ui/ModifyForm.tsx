import IndividualForm from "./IndividualForm";
import CorporationForm from "./CorporationForm";
import { FlexBox, Separator, Button } from "@repo/ui";
import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { useJoinForm } from "@widgets/auth/joinForm/model/form";
import type { JoinSchemaType } from "@widgets/auth/joinForm/schema";
import { useNavigate } from "react-router-dom";

const ModifyForm = () => {
  const form = useJoinForm();
  const navigate = useNavigate();
  const onSubmit = (values: JoinSchemaType) => {
    console.log(values);
  };
  const [acount, setAcount] = useState<string>("corp");
  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <IndividualForm />

          {/* 기업인 경우 */}
          {acount === "corp" && (
            <div className="space-y-8">
              <Separator className="mt-10" />
              <CorporationForm />
            </div>
          )}

          <FlexBox grow>
            <Button variant="outline" className="w-full" onClick={() => navigate(-1)}>
              취소
            </Button>
            <Button type="submit" variant="primary" className="w-full">
              수정
            </Button>
          </FlexBox>
        </form>
      </FormProvider>
    </>
  );
};

export default ModifyForm;
