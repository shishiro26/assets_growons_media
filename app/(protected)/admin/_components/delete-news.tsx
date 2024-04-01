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
import { toast } from "sonner";
import { deleteNews } from "@/actions/news";

const RemoveNews = ({ id }: { id: string }) => {
  const handleDelete = (id: string) => {
    deleteNews({ id }).then((data) => {
      if (data?.success) {
        toast.success(data.success);
      }
      if (data?.error) {
        toast.error(data.error);
      }
    });
  };

  return (
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
  );
};

export default RemoveNews;
