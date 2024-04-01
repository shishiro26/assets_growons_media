"use client";
import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import DownloadButton from "@/components/shared/download";
import BadgeStatus from "../../money/_components/BadgeStatus";
import Link from "next/link";
import FileDownload from "./file-download";

type Order = {
  public_id: string;
  secure_url: string;
  fileName: string;
};

const FileDialog = ({ files, status }: { files: Order[]; status: string }) => {
  return (
    <Dialog>
      <DialogTrigger>Download</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">Your orders:</DialogTitle>
          {files.map((file, index) => {
            return (
              <div key={index} className="flex flex-row items-center">
                <p className="capitalize font-bold">
                  {file.fileName.split(".")[0]}
                </p>
                <FileDownload
                  secure_url={file.secure_url}
                  fileName={file.fileName}
                />
              </div>
            );
          })}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default FileDialog;
