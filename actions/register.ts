"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail, getUserByNumber } from "@/data/user";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name, number } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const username = await db.user.findUnique({
    where: { name: name },
  });

  if (username) {
    return { error: "name already in use!" };
  }

  const existingUser = await getUserByEmail(email);
  const existingUserByNumber = await getUserByNumber(number);

  if (existingUserByNumber) {
    return { error: "Number already in use" };
  }
  if (existingUser) {
    return { error: "Email already in use!" };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      number,
    },
  });

  return { success: "User created!" };
};
