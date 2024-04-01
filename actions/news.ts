"use server";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { EditNewsSchema, NewsSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";
export const addNews = async (values: z.infer<typeof NewsSchema>) => {
  const validatedFields = NewsSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { userId, title, content } = validatedFields.data;

  const user = await getUserById(userId);

  if (user?.role !== "ADMIN") {
    return { error: "You are not authorized to add news" };
  }

  try {
    await db.news.create({
      data: {
        userId,
        title,
        content,
      },
    });
    revalidatePath("/admin/news");
    return { success: "News Added" };
  } catch (error) {
    return { error: "Error adding news" };
  }
};

export const deleteNews = async ({ id }: { id: string }) => {
  try {
    await db.news.delete({
      where: { id },
    });
    revalidatePath("/admin/news");
    return { success: "News deleted" };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Error deleting News" };
  }
};

export const editNews = async (values: z.infer<typeof EditNewsSchema>) => {
  const validatedFields = EditNewsSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { id, title, content, userId } = validatedFields.data;

    const user = await getUserById(userId);

    if (user?.role !== "ADMIN") {
        return { error: "You are not authorized to edit news" };
        }

  try {
    await db.news.update({
      where: { id },
      data: {
        title,
        content,
      },
    });
    revalidatePath("/admin/news");
    return { success: "Successfully edited the news" };
  } catch (error) {
    return { error: "Error editing news" };
  }
};
