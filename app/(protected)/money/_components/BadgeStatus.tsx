import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const BadgeStatus = ({ status }: { status: string }) => {
  return (
    <>
      {status === "PENDING" ? (
        <Popover>
          <PopoverTrigger>
            <Badge variant={"secondary"} className="cursor-pointer">
              {status}
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="text-center w-fit h-fit rounded-lg">Waiting for approval.</PopoverContent>
        </Popover>
      ) : status === "SUCCESS" ? (
        <Badge className="bg-green-500 hover:bg-green-500/75 cursor-pointer">
          {status}
        </Badge>
      ) : (
        <Badge variant={"destructive"} className="cursor-pointer">
          {status}
        </Badge>
      )}
    </>
  );
};

export default BadgeStatus;
