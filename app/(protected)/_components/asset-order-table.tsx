import { formatPrice } from "@/components/shared/formatPrice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

const AssetOrderTable = async ({ assets }: { assets: any[] }) => {
  return (
    <>
      {assets?.map((asset, index) => {
        return (
          <div
            key={asset.id}
            className="p-2 mt-4 border-2 border-gray-300 rounded-lg"
          >
            <div className="text-lg capitalize">{asset.name}</div>
            <span className="text-xs capitalize text-gray-500">
              {asset.description}
            </span>
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stock</TableHead>
                    <TableHead>Min</TableHead>
                    <TableHead>Max</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {asset.stock === 0 ? (
                        <span className="font-semibold">Out of stock</span>
                      ) : (
                        <span className="font-semibold">available</span>
                      )}
                    </TableCell>
                    <TableCell>{asset.minasset}</TableCell>
                    <TableCell>{asset.maxasset}</TableCell>
                    <TableCell>{formatPrice(asset.price)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default AssetOrderTable;
