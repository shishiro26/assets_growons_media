"use client";
import { formatPrice } from "@/components/shared/formatPrice";
import { useCurrentUser } from "@/hooks/use-current-user";
import React, { useEffect, useState } from "react";

const TotalMoney = () => {
  const session = useCurrentUser();
  const [amount, setAmount] = useState(session?.amount ?? 0);

  useEffect(() => {
    setAmount(session?.amount ?? 0);
  }, [session]);

  return (
    <>
      <span className="font-semibold">{formatPrice(amount)}</span>
    </>
  );
};

export default TotalMoney;
