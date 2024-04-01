import RegisterForm from "@/components/shared/auth/register-form";
import React from "react";

export const generateMetadata = () => {
  return {
    title: "Signup | GrowonsMedia",
    description: "Signup to GrowonsMedia",
  };
};

const page = () => {
  return (
    <>
      <RegisterForm />
    </>
  );
};

export default page;
