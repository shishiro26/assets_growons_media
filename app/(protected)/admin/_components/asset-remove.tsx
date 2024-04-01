"use client";
import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteAsset } from "@/actions/assets";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { EditAssetFormSchema } from "@/schemas";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

const AssetRemove = ({ id }: { id: string }) => {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof EditAssetFormSchema>>({
    resolver: zodResolver(EditAssetFormSchema),
    defaultValues: {
      minAsset: 0,
    },
  });

  const handleDelete = (id: string) => {
    deleteAsset({ id }).then((data) => {
      if (data?.success) {
        toast.success(data.success);
      }
      if (data?.error) {
        toast.error(data.error);
      }
    });
  };

  return (
    <div className="flex gap-x-3">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Edit</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit asset</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button asChild>
                <Link href={`/admin/asset/edit-form/${id}`}>Confirm</Link>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"destructive"}>Remove</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure??</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button onClick={() => handleDelete(id)}>Confirm</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssetRemove;
