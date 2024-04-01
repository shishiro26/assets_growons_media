import React from "react";
import Link from "next/link";
import MobileNv from "./MobileNav";
import NavItems from "./NavItems";
import Image from "next/image";

const Sidebar = () => {
  return (
    <>
      <MobileNv />
      <aside
        id="sidebar-multi-level-sidebar"
        className={`hidden md:block z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 overflow-hidden font-extrabold`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 space-y-2">
          <Link
            href={"/"}
            className="flex items-center p-2 text-gray-900 rounded-lg"
          >
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
          </Link>
          <NavItems />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
