import { db } from "@/lib/db";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableCell,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import React from "react";

const ViewAssets = async ({ orderId }: { orderId: string }) => {
  const order = await db.order.findUnique({
    where: {
      orderId: orderId,
    },
    select: {
      assets: true,
      updatedAt: true,
      status: true,
    },
  });

  const assetsArray = JSON.parse(JSON.stringify(order?.assets));

  return (
    <Dialog>
      <DialogTrigger>View Assets</DialogTrigger>
      <DialogContent>
        <Table>
          <TableCaption>List of your recent Orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>OrderId</TableHead>
              <TableHead>Assets</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>UpdatedAt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assetsArray.map((asset: any, index: number) => {
              return (
                <TableRow key={index}>
                  <TableCell>{orderId}</TableCell>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{order?.status}</TableCell>
                  <TableCell>{order?.updatedAt.toDateString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAssets;
