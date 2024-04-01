"use client";
import { formatPrice } from "@/components/shared/formatPrice";
import { Button } from "@/components/ui/button";
import React from "react";
import * as XLSX from "xlsx";
type Money = {
  amount: string | null;
};

type Order = {
  amount: number;
};

type User = {
  id: string;
  email: string;
  name: string;
  number: string;
  password: string;
  totalMoney: number;
  role: "USER" | "PRO" | "ADMIN" | "BLOCKED";
  createdAt: Date;
  money: Money[];
  Order: Order[];
};

type DownloadToExcelProps = {
  data: User[];
  fileName: string;
};

const DownloadToExcel: React.FC<DownloadToExcelProps> = ({
  data,
  fileName,
}) => {
  const modifiedData = data.map((user) => ({
    Name: user.name,
    "WhatsApp Number": user.number,
    "Created At": user.createdAt.toDateString(),
    "Total Order": formatPrice(
      user.Order.reduce((total, order) => total + order.amount, 0)
    ),
    "Total Wallet Money": formatPrice(
      user.money.reduce((total, money) => total + Number(money.amount), 0)
    ),
    "Current Balance": formatPrice(user.totalMoney),
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

export default DownloadToExcel;
