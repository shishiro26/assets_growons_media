import React from "react";
import OrderForm from "../../_components/order-form";
import { db } from "@/lib/db";
import TopBar from "../../_components/Topbar";
import AssetOrderTable from "../../_components/asset-order-table";

export const generateMetadata = () => {
  return {
    title: "Orders | GrowonsMedia",
    description: "Orders page",
  };
};

const page = async ({ params }: { params: { id: string } }) => {
  const assets = await db.asset.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const proUser = await db.proUser.findUnique({
    where: {
      userId: params.id,
    },
  });

  const user = await db.user.findUnique({
    where: {
      id: params.id,
    },
    select: {
      role: true,
    },
  });

  const mergedAssets = assets.map((asset) => {
    //@ts-ignore
    const proUserAsset = proUser?.assets?.find(
      (proUserAsset: any) => proUserAsset.name === asset.assetName
    );

    return {
      id: asset.id,
      name: asset.assetName,
      stock: asset.stock,
      minAsset: proUserAsset?.minAsset ?? asset.minAsset,
      maxAsset: proUserAsset?.maxAsset ?? asset.maxAsset,
      price: proUserAsset?.price ?? asset.price,
      description: asset.description,
    };
  });

  return (
    <>
      <div className="hidden md:block">
        <TopBar title="Add order" />
      </div>
      <section>
        <div className="m-3">
          <OrderForm
            id={params.id.toString()}
            assets={mergedAssets}
            role={user?.role}
          >
            <AssetOrderTable assets={mergedAssets} />
          </OrderForm>
        </div>
      </section>
    </>
  );
};

export default page;
