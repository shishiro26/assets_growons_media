"use client";
import React from "react";
import { Download } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

const DownloadButton = ({ imageLink }: { imageLink: string }) => {
  const downloadQR = () => {
    const image = imageLink ?? "/svgs/qrcode.webp";
    const downloadName =
      image !== "/svgs/qrcode.webp" ? "invoice.png" : "qrcode.png";
    fetch(image)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement("a");
        a.href = url;
        a.download = downloadName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success("Downloaded the image", {
          action: {
            label: "close",
            onClick: () => console.log("Undo"),
          },
        });
      })
      .catch((error) => console.error("Error downloading the image", error));
  };
  return (
    <Button variant={"ghost"}>
      <Download className="w-5 h-5" onClick={downloadQR} />
    </Button>
  );
};

export default DownloadButton;
