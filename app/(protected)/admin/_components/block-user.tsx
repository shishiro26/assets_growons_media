"use client";
import React from "react";
import { blockUser, unblockUser } from "@/actions/user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type BlockUserProps = {
  id: string;
  role: "USER" | "ADMIN" | "BLOCKED" | "PRO";
};

const BlockUser: React.FC<BlockUserProps> = ({ id, role }) => {
  const handleBlock = (id: string) => {
    blockUser(id).then((data) => {
      if (data.success) {
        toast.success(data.success, {
          action: {
            label: "close",
            onClick: () => console.log("Undo"),
          },
        });
      }
      if (data?.error) {
        toast.error(data.error, {
          action: {
            label: "close",
            onClick: () => console.log("undo"),
          },
        });
      }
    });
  };

  const handleUnblock = (id: string) => {
    unblockUser(id).then((data) => {
      if (data?.success) {
        toast.success(data.success, {
          action: {
            label: "close",
            onClick: () => console.log("Undo"),
          },
        });
      }
      if (data?.error) {
        toast.error(data.error, {
          action: {
            label: "close",
            onClick: () => console.log("undo"),
          },
        });
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          {role === "BLOCKED" ? "Unblock" : "Block user"}
        </Button>
      </DialogTrigger>
      <DialogContent className="m-2">
        {role === "BLOCKED" ? (
          <>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to unblock this user?
              </DialogTitle>
              <DialogDescription>
                This will unblock the user from transactions and orders.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose>
                <Button type="button" onClick={() => handleUnblock(id)}>
                  Confirm
                </Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to block this user?
              </DialogTitle>
              <DialogDescription>
                This will block the user from transactions and orders.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose>
                <Button variant={"destructive"} onClick={() => handleBlock(id)}>
                  Confirm
                </Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BlockUser;
