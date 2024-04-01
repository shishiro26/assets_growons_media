import { LoginForm } from "@/components/shared/auth/login-form";

export const generateMetadata = () => {
  return {
    title: "Login | GrowonsMedia",
    description: "Login to GrowonsMedia",
  };
};

const LoginPage = () => {
  return <LoginForm />;
};

export default LoginPage;
