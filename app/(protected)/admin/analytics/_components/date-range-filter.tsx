"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const DateRangeFilter: React.FC = () => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleRange = () => {
    const params = new URLSearchParams(searchParams);

    if (startDate > endDate) {
      toast.error("Start date should be less than end date");
      return;
    }

    if (startDate && endDate) { 
      const startDateISOString = new Date(startDate).toISOString();
      const endDateISOString = new Date(endDate).toISOString();
      params.set("startDate", startDateISOString);
      params.set("endDate", endDateISOString);
      replace(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Input
        type={"date"}
        placeholder="start date"
        className="w-fit"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <Input
        type={"date"}
        placeholder="end date"
        className="w-fit"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <Button onClick={handleRange} variant={"ghost"}>
        <FilterIcon className="h-5 w-5 cursor-pointer" />
      </Button>
    </div>
  );
};

export default DateRangeFilter;
