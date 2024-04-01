"use client";
import { Copy } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";

type CopyButtonProps = {
  text: string;
};

const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(text).then((data) => {
        toast.success("Copied to clipboard", {
          action: {
            label: "close",
            onClick: () => console.log("Undo"),
          },
        });
        return { success: "Copied to clipboard!" };
      });
    } catch (err) {
      console.log(err);
      return { error: "Failed to copy!" };
    }
  };

  return <Copy className="w-4 h-4 cursor-pointer" onClick={handleCopy} />;
};

export default CopyButton;
