import Image from "next/image";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/shared/auth/log-out-button";
import { LogOut } from "lucide-react";
import { auth } from "@/auth";
import TotalMoney from "./TotalMoney";

const TopBar = async ({ title }: { title: string }) => {
  const session = await auth();
  return (
    <nav className="md:flex md:items-center md:justify-between">
      <div className="hidden md:block ml-2 ">
        <h1 className="text-nowrap text-xl">{title}</h1>
      </div>
      <div className="flex items-center justify-end">
        {session?.user.role !== "ADMIN" && (
          <div className="flex items-center mr-2">
            <Image
              src={"/svgs/coin.svg"}
              width={5}
              height={5}
              alt="coin"
              className="w-6 h-6 m-2"
            />
            <p className="font-semibold">
              <TotalMoney />
            </p>
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="link"
              className="font-semibold pointer text-lg capitalize"
            >
              {session?.user.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="m-1 w-48">
            <DropdownMenuLabel className="capitalize">
              {session?.user.name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <LogoutButton>
              <DropdownMenuItem>
                <div className="cursor-pointer flex">
                  <LogOut className="h-4 w-4 mr-2 cursor-pointer" />
                  Logout
                </div>
              </DropdownMenuItem>
            </LogoutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default TopBar;
