import { SessionProvider } from "next-auth/react";
import Sidebar from "./_components/sidebar";
import { auth } from "@/auth";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Image from "next/image";
import { db } from "@/lib/db";
import Link from "next/link";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});
interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const session = await auth();
  const link = await db.support.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      link: true,
    },
  });
  return (
    <SessionProvider session={session}>
      <div className="h-full md:overflow-hidden">
        <div className={`${font.className} md:flex md:flex-row`}>
          <Sidebar />
          <div className="md:flex-1 m-1 w-full md:overflow-hidden">
            <Toaster />
            {children}
          </div>
        </div>
        <div className="bg-white/55 h-14 w-14 rounded-full flex items-center justify-center cursor-pointer absolute right-0 md:right-3 md:bottom-3 z-50 ">
          <Link
            href={link?.link ?? "https://leads.growonsmedia.com/"}
            target="_blank"
            className="flex items-center justify-center flex-col"
          >
            <Image
              src={"/svgs/whatsapp.svg"}
              alt="whatsapp"
              width={35}
              height={35}
              className="cursor-pointer hover:scale-110 transition-all"
            />
            <p className="font-bold text-[10px] text-nowrap">Talk to us</p>
          </Link>
        </div>
      </div>
    </SessionProvider>
  );
};

export default ProtectedLayout;
