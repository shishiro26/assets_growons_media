import { getUserById } from "@/data/user";
import React from "react";

const GetName = async ({ userId }: { userId: string }) => {
  const user = await getUserById(userId);
  return <>{user?.name}</>;
};

export default GetName;
