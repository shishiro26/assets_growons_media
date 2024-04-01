import React from "react";
import { db } from "@/lib/db";
import {
  Table,
  TableBody,
  TableFooter,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaginationBar from "../../money/_components/PaginationBar";
import { formatPrice } from "@/components/shared/formatPrice";
import { revalidatePath } from "next/cache";
import DescriptionDialog from "./description-dialog";
import AssetRemove from "./asset-remove";

export const revalidate = 3600;

const AssetTable = async ({
  searchParams,
}: {
  searchParams: { page: string };
}) => {
  const currentPage = parseInt(searchParams.page) || 1;

  const pageSize = 7;

  const totalItemCount = await db.asset.count();

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const assets = await db.asset.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      userId: false,
      id: true,
      assetName: true,
      price: true,
      stock: true,
      minAsset: true,
      maxAsset: true,
      description: true,
      createdAt: true,
    },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  revalidatePath("/admin/asset");

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Minimum</TableHead>
            <TableHead>Maximum</TableHead>
            <TableHead>Created_At</TableHead>
          </TableRow>
        </TableHeader>
        {totalItemCount === 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No assets found
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell className="capitalize">{asset.assetName}</TableCell>
              <TableCell>
                <DescriptionDialog description={asset.description} />
              </TableCell>
              <TableCell>{formatPrice(asset.price)}</TableCell>
              <TableCell>{asset.stock}</TableCell>
              <TableCell>{asset.minAsset}</TableCell>
              <TableCell>{asset.maxAsset}</TableCell>
              <TableCell>{asset.createdAt.toDateString()}</TableCell>
              <TableCell>
                <AssetRemove id={asset.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <PaginationBar totalPages={totalPages} currentPage={currentPage} />
      )}
    </>
  );
};

export default AssetTable;
