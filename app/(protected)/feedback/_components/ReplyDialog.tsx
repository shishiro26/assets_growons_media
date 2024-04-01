"use client";
import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FileDownload from "../../admin/_components/file-download";
import Link from "next/link";

type FeedbackProps = {
  reply: string;
};

const ReplyDialog = ({ reply }: FeedbackProps) => {
  return (
    <Dialog>
      <DialogTrigger>Reply</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">Files:</DialogTitle>
          <div className="flex items-center justify-center">
            {reply.includes("https") ? (
              <Link href={reply}>{reply}</Link>
            ) : (
              <>{reply}</>
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyDialog;
