"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { Download } from "lucide-react";

const FileDownload = ({
  secure_url,
  fileName,
}: {
  secure_url: string;
  fileName: string;
}) => {
  const downloadFile = async () => {
    try {
      const response = await fetch(secure_url);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file", error);
    }
  };
  return (
    <Button variant={"ghost"}>
      <Download className="w-5 h-5" onClick={downloadFile} />
    </Button>
  );
};

export default FileDownload;
