import React from "react";

interface Asset {
  name: string;
  quantity: number;
}

interface Order {
  id: string;
  orderId: string;
  userId: string;
  assets: Asset[];
  amount: number;
  reason: string | null;
  status: "SUCCESS" | "PENDING" | "FAILED";
  createdAt: Date;
  updatedAt: Date;
}

type AssetProps = {
  orders: Order[];
  assetName: string;
};

const AssetQuantity = ({ orders, assetName }: AssetProps) => {
  const quantitySold = orders.reduce((acc, order) => {
    const quantityAsset = order.assets.find((asset) => {
      return asset.name === assetName;
    });
    if (quantityAsset) {
      return acc + quantityAsset.quantity;
    }
    return acc;
  }, 0);

  return <span className="text-center">{quantitySold}</span>;
};

export default AssetQuantity;
