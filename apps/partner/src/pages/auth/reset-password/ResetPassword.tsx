import OnlyForm from "@shared/router/layout/page/OnlyForm";
import ResetPasswordForm from "@widgets/auth/reset-password/ui/ResetPasswordForm";

const ResetPassword = () => {
  return (
    <OnlyForm className="items-center [&>div]:w-[315px]">
      <ResetPasswordForm />
    </OnlyForm>
  );
};

export default ResetPassword;
