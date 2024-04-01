import { db } from "@/lib/db";
import React from "react";
import EditProUserForm from "./_components/edit-pro-user";

const EditProUser = async ({ params }: { params: { id: string } }) => {
  const proUser = await db.proUser.findUnique({
    where: {
      userId: params.id,
    },
  });

  return (
    <div>
      <EditProUserForm user={JSON.parse(JSON.stringify(proUser))} />
    </div>
  );
};

export default EditProUser;
