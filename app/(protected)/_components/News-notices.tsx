import React from "react";
import { getNewsById } from "@/lib/news";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { db } from "@/lib/db";

const NewsNotices = async () => {
  const news = await db.news.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    skip: 0,
    select: {
      id: true,
      title: true,
      content: true,
    },
  });
  const newsLength = (await getNewsById()).length;
  const urlPattern =
    /^(?:(?:ftp|http|https):\/\/|www\.)|(?:[\w-]+\.)+[a-z]{2,}(?:\/[^]*)?$/i;

  return (
    <div className="border-2 mt-4 mx-2 md:mt-10 border-black  p-2 rounded-lg">
      <span className="m-2">News and Notices</span>
      <div className="grid grid-cols-1 md:grid-cols-3 h-64 overflow-x-hidden overflow-y-auto">
        {newsLength === 0 ? (
          <div className="m-2 font-serif">Nothing to show here</div>
        ) : (
          <>
            {news?.map((n) => {
              return (
                <Card key={n.id} className="m-2 md:w-[300px] h-fit">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold capitalize">
                      {n.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    {n.content.match(urlPattern) ? (
                      <a
                        href={
                          n.content.startsWith("http") ||
                          n.content.startsWith("www")
                            ? n.content
                            : `http://${n.content}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#3b49df] underline"
                      >
                        {n.content}
                      </a>
                    ) : (
                      <>{n.content}</>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default NewsNotices;
