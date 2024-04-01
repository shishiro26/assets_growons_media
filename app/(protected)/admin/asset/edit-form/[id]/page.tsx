import React from "react";
import AssetEditForm from "../../../_components/asset-edit-form";
import { db } from "@/lib/db";
import TopBar from "@/app/(protected)/_components/Topbar";

export const generateMetadata = () => {
  return {
    title: "Edit Asset | GrowonsMedia",
    description: "Edit Asset",
  };
};

const page = async ({ params }: { params: { id: string } }) => {
  const asset = await db.asset.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      assetName: true,
      description: true,
      price: true,
      minAsset: true,
      maxAsset: true,
      stock: true,
    },
  });

  return (
    <>
      <nav className="md:block hidden">
        <TopBar title="Edit Asset" />
      </nav>
      <section>
        <div className="m-1">
          <AssetEditForm asset={asset} />
        </div>
      </section>
    </>
  );
};

export default page;
