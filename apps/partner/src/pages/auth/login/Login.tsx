import OnlyForm from "../../../shared/router/layout/page/OnlyForm";
import LoginForm from "../../../widgets/auth/login-form/ui/LoginForm";

const Login = () => {
  return (
     <OnlyForm className="items-center [&>div]:w-[315px]">
      <LoginForm />
     </OnlyForm>
  );
};

export default Login;
