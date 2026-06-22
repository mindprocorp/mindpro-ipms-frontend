import OnlyForm from "@shared/router/layout/page/OnlyForm";
import IdFindForm from "@widgets/auth/idFind/ui/IdFindForm";

const IdFind = () => {
  return (
    <OnlyForm className="items-center [&>div]:w-[360px]">
      <IdFindForm />
    </OnlyForm>
  );
};

export default IdFind;
