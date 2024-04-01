"use server";

import { db } from "@/lib/db";
import {
  EditUserSchema,
  UpdatePasswordSchema,
  updateMoneySchema,
} from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { getUserByEmail, getUserById } from "@/data/user";
import { auth } from "@/auth";

export const blockUser = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    if (user.role === "ADMIN") {
      return { error: "Cannot block an admin." };
    }

    if (user.role === "BLOCKED") {
      return { error: "User is already blocked." };
    }

    await db.user.update({
      where: {
        id: id,
      },
      data: {
        role: "BLOCKED",
      },
    });

    revalidatePath("/admin/user");

    return { success: "User blocked successfully" };
  } catch (error) {
    return {
      error: "An error occurred. Please try again later.",
    };
  }
};

export const unblockUser = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    if (user.role !== "BLOCKED") {
      return { error: "User is not blocked. Cannot perform this action." };
    }

    await db.user.update({
      where: {
        id: id,
      },
      data: {
        role: "USER",
      },
    });

    revalidatePath("/admin/user");

    return { success: "User unblocked successfully" };
  } catch (error) {
    return {
      error: "An error occurred. Please try again later.",
    };
  }
};

export const editUser = async (values: z.infer<typeof EditUserSchema>) => {
  const validatedFields = EditUserSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields" };
  }

  const { id, name, number, email } = validatedFields.data;

  const existingUser = await db.user.findFirst({
    where: {
      email: email,
      NOT: { id: id },
    },
  });
  if (existingUser) {
    return { error: "Email already in use!" };
  }

  const existingUsername = await db.user.findFirst({
    where: { name: name, NOT: { id: id } },
  });

  if (existingUsername) {
    return { error: "Username already exists." };
  }
  try {
    await db.user.update({
      where: {
        id: values.id,
      },
      data: {
        name: name,
        number: number,
        email: email,
      },
    });
  } catch (error) {
    console.log(error);
    return { error: "An error occurred. Please try again later." };
  }

  revalidatePath("/admin/user");
  return { success: "User updated successfully" };
};

export const updateMoney = async (
  values: z.infer<typeof updateMoneySchema>
) => {
  const validatedFields = updateMoneySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields" };
  }

  const { userId, amount } = validatedFields.data;

  const user = await getUserById(userId);

  if (!user) {
    return { error: "User not found" };
  }
  let newAmount = user.totalMoney;

  if (newAmount === amount) {
    return { error: "No change in amount" };
  }
  try {
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        totalMoney: amount,
      },
    });

    const moneyId = Date.now() + Math.floor(Math.random() * 100000);

    await db.walletFlow.create({
      data: {
        userId: userId,
        moneyId: moneyId.toString().slice(-11),
        amount: amount || 0,
        purpose: "ADMIN",
      },
    });
  } catch (error) {
    return { error: "An error occurred. Please try again later." };
  }

  revalidatePath("/admin/user");
  revalidatePath(`/admin/user/update-money/${userId}`);
  return { success: "Amount updated successfully" };
};

export const updatePassword = async (
  values: z.infer<typeof UpdatePasswordSchema>
) => {
  const validatedFields = UpdatePasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Fields" };
  }

  const { id, password } = validatedFields.data;

  const admin = await auth();

  if (!admin) {
    return { error: "Unauthorized" };
  }

  const user = await getUserById(id);

  if (user) {
    const isMatchedPassword = await bcrypt.compare(password, user.password);

    if (isMatchedPassword) {
      return { error: "Password already used." };
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await db.user.update({
      where: {
        id: id,
      },
      data: {
        password: hashedPassword,
      },
    });
  } catch (err) {
    return { error: "An error occurred. Please try again later." };
  }

  revalidatePath("/admin/user");
  return { success: "password updated successfully" };
};
