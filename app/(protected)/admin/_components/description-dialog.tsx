import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React from "react";

const DescriptionDialog = ({ description }: { description: string }) => {
  return (
    <Dialog>
      <DialogTrigger>description</DialogTrigger>
      <DialogContent>
        <div className="p-2">
          <h1 className="text-xl font-semibold">Description</h1>
          <p className="text-md mt-2">{description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DescriptionDialog;
