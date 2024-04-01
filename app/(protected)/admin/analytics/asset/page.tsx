import { formatPrice } from "@/components/shared/formatPrice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import React from "react";
import AssetSold from "../_components/asset-sold";
import DateRangeFilter from "../_components/date-range-filter";
import { revalidatePath } from "next/cache";
import Search from "@/components/shared/search";
import AssetToExcel from "../_components/asset-to-excel";
import AssetQuantity from "../_components/asset-quantity";

const AssetAnalytics = async ({
  searchParams,
}: {
  searchParams: { page: string; startDate: Date; endDate: Date };
}) => {
  const currentPage = parseInt(searchParams.page) || 1;
  const pageSize = 9;
  const startDate = searchParams.startDate || new Date("1983-01-01");
  const endDate = searchParams.endDate || new Date();

  const totalItemCount = await db.order.count();
  const totalPages = Math.ceil(totalItemCount / pageSize);

  const assets = await db.asset.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  const orders = await db.order.findMany({
    where: {
      status: "SUCCESS",
      createdAt: {
        lte: endDate,
        gte: startDate,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  revalidatePath("/admin/analytics/asset");

  return (
    <section className="m-2">
      <div className="flex items-center justify-between gap-x-2 p-1 md:hidden">
        <AssetToExcel
          assets={JSON.parse(JSON.stringify(assets))}
          orders={JSON.parse(JSON.stringify(orders))}
          fileName={"Assets"}
        />
        <Search fileName="asset" />
      </div>
      <div className="md:flex md:items-center md:justify-between md:gap-x-2">
        <div className="hidden md:flex items-center justify-between  gap-x-3">
          <AssetToExcel
            assets={JSON.parse(JSON.stringify(assets))}
            orders={JSON.parse(JSON.stringify(orders))}
            fileName={"Assets"}
          />
          <Search fileName="asset" />
        </div>
        <div className="mt-1 flex items-center justify-around gap-x-2 w-fit">
          <DateRangeFilter />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset name</TableHead>
            <TableHead>Current price</TableHead>
            <TableHead>Total Qty sold</TableHead>
            <TableHead>Total revenue collected</TableHead>
            <TableHead>Current inventory</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell>{asset.assetName}</TableCell>
              <TableCell>{formatPrice(asset.price)}</TableCell>
              <TableCell>
                {
                  <AssetQuantity
                    orders={JSON.parse(JSON.stringify(orders))}
                    assetName={asset.assetName}
                  />
                }
              </TableCell>
              <TableCell>
                {
                  <AssetSold
                    assetName={asset.assetName}
                    orders={JSON.parse(JSON.stringify(orders))}
                  />
                }
              </TableCell>
              <TableCell>{asset.stock}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};

export default AssetAnalytics;
