import OnlyForm from "@shared/router/layout/page/OnlyForm";
import PwFindForm from "@widgets/auth/pwFind/ui/PwFindForm";

const PwFind = () => {
  return (
    <OnlyForm className="items-center [&>div]:w-[360px]">
      <PwFindForm />
    </OnlyForm>
  );
};

export default PwFind;
