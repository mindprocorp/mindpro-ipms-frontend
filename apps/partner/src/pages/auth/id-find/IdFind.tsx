import OnlyForm from "@shared/router/layout/page/OnlyForm";
import IdFindForm from "@widgets/auth/id-find/ui/IdFindForm";

const IdFind = () => {
  return (
    <OnlyForm className="items-center [&>div]:w-[315px]">
      <IdFindForm />
    </OnlyForm>
  );
};

export default IdFind;
