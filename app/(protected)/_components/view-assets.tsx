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

type Asset = {
  name: string;
  quantity: number;
};

const ViewAssets = ({ assets }: { assets: Asset[] }) => {
  return (
    <Dialog>
      <DialogTrigger>View Assets</DialogTrigger>
      <DialogContent>
        <Table>
          <TableCaption>List of your recent Orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{asset.quantity}</TableCell>
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
