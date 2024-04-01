import React from "react";
import Link from "next/link";
import { AdminSidebar, SidebarItems } from "./NavBarItems";
import { auth } from "@/auth";

const NavItems = async () => {
  const session = await auth();
  return (
    <ul className="space-y-2 font-medium">
      <li>
        <Link
          href="/"
          className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 "
        >
          <span className="flex-1 ms-3 whitespace-nowrap">Dashboard</span>
        </Link>
      </li>
      {session?.user.role === "ADMIN" ? (
        <></>
      ) : (
        <>
          <li>
            <Link
              href={`/money/record/${session?.user?.id}`}
              className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 "
            >
              <span className="flex-1 ms-3 whitespace-nowrap">Wallet</span>
            </Link>
          </li>
          <li>
            <Link
              href={`/money/wallet-flow/${session?.user?.id}`}
              className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 "
            >
              <span className="flex-1 ms-3 whitespace-nowrap">Wallet flow</span>
            </Link>
          </li>
          <li>
            <SidebarItems userId={session?.user.id?.toString() ?? ""} />
          </li>
          <li>
            <Link
              href={`/feedback/reply/${session?.user.id}`}
              className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 "
            >
              <span className="flex-1 ms-3 whitespace-nowrap">Feedback</span>
            </Link>
          </li>
        </>
      )}
      {session?.user.role === "ADMIN" && <AdminSidebar />}
    </ul>
  );
};

export default NavItems;
