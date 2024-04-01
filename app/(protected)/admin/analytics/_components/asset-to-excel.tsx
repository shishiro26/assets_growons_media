"use client";
import React from "react";
import { formatPrice } from "@/components/shared/formatPrice";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

interface Asset {
  id: string;
  userId: string;
  assetName: string;
  price: number;
  minAsset: number;
  maxAsset: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  orderId: string | null;
}

interface Asset {
  name: string;
  quantity: number;
  assetPrice: number;
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

type AssetToExcelProps = {
  assets: Asset[];
  fileName: string;
  orders: Order[];
};

const AssetToExcel = ({ assets, fileName, orders }: AssetToExcelProps) => {
  const modifiedData = assets.map((asset) => ({
    "Asset name": asset.assetName,
    "Current price": asset.price,
    "Total quantity sold": orders.reduce((acc, order) => {
      const quantityAsset = order.assets.find((prod) => {
        return prod.name === asset.assetName;
      });
      if (quantityAsset) {
        return acc + quantityAsset.quantity;
      }
      return acc;
    }, 0),
    "Total revenue generated": formatPrice(
      orders.reduce((acc, order) => {
        const quantityAsset = order.assets.find((prod) => {
          return prod.name === asset.assetName;
        });
        if (quantityAsset) {
          return acc + quantityAsset.assetPrice * quantityAsset.quantity;
        }
        return acc;
      }, 0)
    ),
    "Current inventory": asset.stock,
  }));

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(modifiedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Assets");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <Button type="button" onClick={handleDownload}>
      Export to Excel
    </Button>
  );
};

export default AssetToExcel;
