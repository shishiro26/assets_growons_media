import React from "react";
import { auth } from "@/auth";
import SupportLinkForm from "./support-link-form";

const SupportLink = async () => {
  const session = await auth();
  return (
    <div className="flex justify-around flex-col mx-2 mt-5 w-full md:w-56 bg-gray-100 p-2 rounded-lg h-24 md:h-28">
      <div className="flex justify-between items-center">
        <span className="font-semibold">Add link</span>
      </div>
      <p className="mt-3">
        <SupportLinkForm userId={session?.user.id ?? ""} />
      </p>
    </div>
  );
};

export default SupportLink;
