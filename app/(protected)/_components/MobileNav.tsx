import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React from "react";
import NavItems from "./NavItems";
import TopBar from "./Topbar";
import Image from "next/image";

const MobileNv = () => {
  return (
    <div className="m-2 flex justify-between md:hidden">
      <Sheet>
        <SheetTrigger>
          <svg
            className="w-6 h-6 text-gray-900"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </SheetTrigger>
        <SheetContent
          className="w-[300px] flex flex-col gap-6 bg-white overflow-auto md:hidden"
          side={"left"}
        >
          <SheetTitle>
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
          </SheetTitle>
          <Separator className="border border-gray-50" />
          <NavItems />
        </SheetContent>
      </Sheet>
      <TopBar title="Dashboard" />
    </div>
  );
};

export default MobileNv;
