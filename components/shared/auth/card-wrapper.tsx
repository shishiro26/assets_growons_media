"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type CardWrapperProps = {
  children: React.ReactNode;
  headerLabel?: string;
  backButtonLabel: string;
  backButtonHref: string;
};

import { Poppins } from "next/font/google";
import Image from "next/image";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const CardWrapper = ({
  children,
  backButtonLabel,
  backButtonHref,
  headerLabel,
}: CardWrapperProps) => {
  return (
    <Card className="m-1 shadow-md w-full lg:max-w-lg lg:p-0 sm:p-8 bg-white rounded-lg">
      <CardHeader>
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <div className="w-64 h-20">
            <Image
              src={"/svgs/logo.webp"}
              alt="GrowonsMedia"
              width={150}
              height={10}
              priority
              quality={100}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-muted-foreground text-md">{headerLabel}</p>
          <p className=" text-muted-foreground text-sm">Leads panel</p>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <Button variant="link" className="font-normal w-full" size="sm" asChild>
          <Link href={backButtonHref}>{backButtonLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
