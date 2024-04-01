"use server";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { ProUserSchema, editProUserSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export const addProUser = async (values: z.infer<typeof ProUserSchema>) => {
  const validatedFields = ProUserSchema.safeParse(values);
  if (!validatedFields.success) {
    throw new Error("Invalid fields!");
  }

  const { userId, amount, assets } = validatedFields.data;

  const user = await getUserById(userId);

  if (!user || user.role === "BLOCKED") {
    return { error: "User has been blocked!" };
  }

  if (user.role === "PRO") {
    return { error: "User is already a PRO!" };
  }

  try {
    await db.user.update({
      where: { id: userId },
      data: {
        role: "PRO",
      },
    });

    const uniqueAssets = assets.reduce((acc: any[], asset: any) => {
      const existingAsset = acc.find((p) => p.name === asset.name);
      if (!existingAsset) {
        acc.push({
          name: asset.name,
          minAsset: asset.minAsset,
          maxAsset: asset.maxAsset,
          price: asset.price,
        });
      }
      return acc;
    }, []);

    await db.proUser.create({
      data: {
        amount_limit: amount,
        assets: uniqueAssets,
        userId: userId,
      },
    });

    revalidatePath("/users/" + userId);

    return { success: "upgraded to pro user" };
  } catch (err) {
    console.log(err);
    return { error: "Error while upgrading the user!" };
  }
};

export const removeProUser = async (userId: string) => {
  const user = await getUserById(userId);

  if (!user) {
    return { error: "User not found!" };
  }

  if (user.role !== "PRO") {
    return { error: "User is not a PRO!" };
  }

  try {
    await db.user.update({
      where: { id: userId },
      data: {
        role: "USER",
      },
    });

    await db.proUser.delete({
      where: {
        userId: userId,
      },
    });
  } catch (err) {
    return { error: "Error while downgrading the user!" };
  }

  revalidatePath("/admin/user");
  return { success: "User downgraded to normal user!" };
};

export const editProUser = async (
  values: z.infer<typeof editProUserSchema>
) => {
  const validatedFields = editProUserSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { userId, amount, assets } = validatedFields.data;
  const user = await db.proUser.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return { error: "User is not a PRO!" };
  }

  const error: string[] = [];
  const uniqueAssets = assets?.reduce((acc: any[], asset: any) => {
    if (asset.minAsset > asset.maxAsset) {
      error.push(
        `Min asset cannot be greater than max asset for ${asset.name}`
      );
      return acc;
    }

    const existingAsset = acc.find((p) => p.name === asset.name);
    if (!existingAsset) {
      acc.push({
        name: asset.name.toLowerCase(),
        minAsset: asset.minAsset,
        maxAsset: asset.maxAsset,
        price: asset.price,
      });
    }
    return acc;
  }, []);

  const existingAsset = await db.asset.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const assetNames = existingAsset.map((asset) => asset.assetName);

  for (const prod of uniqueAssets ?? []) {
    if (!assetNames.includes(prod.name)) {
      error.push(prod.name);
    }
  }

  if (error.length > 0) {
    return { error: `Asset ${error.join(", ")} not found!` };
  }

  try {
    await db.proUser.update({
      where: { id: userId },
      data: {
        amount_limit: amount,
        assets: uniqueAssets,
      },
    });
  } catch (err) {
    return { error: "Error while updating the user!" };
  }
  revalidatePath("/admin/user");
  return { success: "Pro user updated!" };
};
