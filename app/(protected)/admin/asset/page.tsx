import React from "react";
import AssetForm from "../_components/asset-form";
import { auth } from "@/auth";
import TopBar from "../../_components/Topbar";

export const generateMetadata = () => {
  return {
    title: "Add Asset | GrowonsMedia",
    description: "Add Asset",
  };
};

const page = async () => {
  const session = await auth();
  return (
    <>
      <nav className="md:block hidden">
        <TopBar title="Add Asset" />
      </nav>
      <section>
        <div className="m-1">
          <AssetForm userId={session?.user.id || ""} />
        </div>
      </section>
    </>
  );
};

export default page;
