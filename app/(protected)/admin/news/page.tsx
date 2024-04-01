import React from "react";
import { auth } from "@/auth";
import NewsForm from "../_components/news-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { db } from "@/lib/db";
import PaginationBar from "../../money/_components/PaginationBar";
import RemoveNews from "../_components/delete-news";
import EditNews from "../_components/edit-news";
import TopBar from "../../_components/Topbar";

export const generateMetadata = () => {
  return {
    title: "News overview | GrowonsMedia",
    description: "News overview",
  };
};

const page = async ({ searchParams }: { searchParams: { page: string } }) => {
  const session = await auth();
  const currentPage = parseInt(searchParams.page) || 1;
  const pageSize = 3;

  const totalItemCount = await db.news.count();
  const totalPages = Math.ceil(totalItemCount / pageSize);

  const news = await db.news.findMany({
    orderBy: {
      createdAt: "desc",
    },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  return (
    <>
      <nav className="hidden md:block">
        <TopBar title="News overview" />
      </nav>
      <section>
        <div className="m-1">
          <NewsForm userId={session?.user.id || ""} />
        </div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          {news.map((n) => {
            return (
              <Card key={n.id} className="m-2 md:w-[300px] h-fit">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">
                    {n.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">{n.content}</CardContent>
                <CardFooter className="flex justify-between">
                  <EditNews n={{ ...n, userId: n.userId || "" }} />
                  <RemoveNews id={n.id} />
                </CardFooter>
              </Card>
            );
          })}
        </div>
        <div className="mb-2">
          {totalPages > 1 && (
            <PaginationBar totalPages={totalPages} currentPage={currentPage} />
          )}
        </div>
      </section>
    </>
  );
};

export default page;
