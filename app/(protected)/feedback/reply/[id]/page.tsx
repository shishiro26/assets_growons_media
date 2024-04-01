import { Button } from "@/components/ui/button";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { Replies } from "../../_components/replies";
import TopBar from "@/app/(protected)/_components/Topbar";

export const generateMetadata = () => {
  return {
    title: "Money wallet | GrowonsMedia",
    description: "Money Record",
  };
};

type RecordProps = {
  params: { id: string };
  searchParams: { page: string };
};

const page = async ({ params, searchParams }: RecordProps) => {
  const session = await auth();
  return (
    <>
      <nav className="hidden md:block">
        <TopBar title="All Feedbacks" />
      </nav>
      <section className="ml-2 mt-4 space-y-4">
        <Button className="flex items-center " asChild>
          <Link href={`/feedback/${session?.user.id}`} className="inline">
            Add your feedback here
          </Link>
        </Button>
        <div>
          <Replies userId={params.id.toString()} searchParams={searchParams} />
        </div>
      </section>
    </>
  );
};

export default page;
