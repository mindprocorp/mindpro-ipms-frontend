import OnlyForm from "@shared/router/layout/page/OnlyForm";
import PwFindForm from "@widgets/auth/pw-find/ui/PwFindForm";

const PwFind = () => {
  return (
    <OnlyForm className="items-center [&>div]:w-[315px]">
      <PwFindForm />
    </OnlyForm>
  );
};

export default PwFind;
