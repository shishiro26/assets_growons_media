import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import TotalMoney from "./TotalMoney";

const BalanceCard = async () => {
  const session = await auth();
  return (
    <div className="flex justify-around flex-col mx-2 mt-5 w-full md:w-56 bg-gray-100 p-2 rounded-lg h-24 md:h-28">
      <div className="flex justify-between items-center">
        <span className="font-semibold">Balance</span>
        <Button variant={"link"} className="font-medium" asChild>
          <Link href={`/money/record/${session?.user?.id}`}>Add money</Link>
        </Button>
      </div>
      <p className="mt-3">
        <TotalMoney />
      </p>
    </div>
  );
};

export default BalanceCard;
