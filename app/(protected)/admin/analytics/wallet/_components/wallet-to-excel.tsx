"use client";
import { formatPrice } from "@/components/shared/formatPrice";
import { Button } from "@/components/ui/button";
import React from "react";
import * as XLSX from "xlsx";

type invoice = {
  id: string;
  name: string;
  amount: string;
  upiid: string;
  accountNumber: string;
  transactionId: string;
  createdAt: Date;
};

type WalletToExcelProps = {
  fileName: string;
  data: invoice[];
};

const WalletToExcel = ({ data, fileName }: WalletToExcelProps) => {
  const modifiedData = data.map((invoice) => ({
    Name: invoice.name,
    "Account no": invoice.accountNumber,
    "UPI-ID": invoice.id,
    "Transaction ID": invoice.transactionId,
    "Total Order": formatPrice(Number(invoice.amount)),
    "Created At": invoice.createdAt,
  }));
  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(modifiedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <Button type="button" onClick={handleDownload}>
      Export to Excel
    </Button>
  );
};

export default WalletToExcel;
