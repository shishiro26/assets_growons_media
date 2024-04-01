import { revalidateTag } from "next/cache";
import { db } from "./db";

export const getNewsById = async () => {
  revalidateTag("/");
  return await db.news.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: { id: true, title: true, content: true, createdAt: true },
    take: 3,
    skip: 0,
  });
};
