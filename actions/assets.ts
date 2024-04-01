"use server";
import { db } from "@/lib/db";
import { EditAssetFormSchema, AssetSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export const addAsset = async (values: z.infer<typeof AssetSchema>) => {
  const validatedFields = AssetSchema.safeParse(values);

  if (!validatedFields.success) {
    console.log(validatedFields.error);
    return { error: "Invalid fields!" };
  }
  const { userId, assetName, price, minAsset, maxAsset, stock, description } =
    validatedFields.data;

  if (minAsset > maxAsset) {
    return { error: "Minimum quantity must be less than maximum quantity" };
  }

  try {
    const asset = await db.asset.findUnique({
      where: { assetName },
    });

    if (asset) {
      return { error: "Asset already exists!" };
    }

    await db.asset.create({
      data: {
        userId,
        assetName,
        description,
        price,
        minAsset: minAsset,
        maxAsset: maxAsset,
        stock: stock,
        createdAt: new Date(),
      },
    });
    revalidatePath("/admin/assets");
    return { success: "Asset Added" };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Error adding asset" };
  }
};

export const deleteAsset = async ({ id }: { id: string }) => {
  try {
    await db.asset.delete({
      where: { id },
    });
    revalidatePath("/admin/assets");
    return { success: "Asset removed" };
  } catch (error) {
    console.error("Error:", error);
    return { error: "Error deleting asset" };
  }
};

export const getAllAssets = async () => {
  try {
    const assets = await db.asset.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return assets;
  } catch (err) {
    return { error: "error while fetching assets" };
  }
};

export const editAsset = async (
  values: z.infer<typeof EditAssetFormSchema>
) => {
  const validatedFields = EditAssetFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { assetName, price, minAsset, maxAsset, id, stock, description } =
    validatedFields.data;

  try {
    if (minAsset !== undefined && minAsset > (maxAsset ?? 0)) {
      return { error: "Minimum quantity must be less than maximum quantity" };
    }

    await db.asset.update({
      where: { id },
      data: {
        assetName,
        description,
        price,
        stock,
        minAsset,
        maxAsset,
      },
    });

    return { success: "Asset updated" };
  } catch (error) {
    return { error: "Error updating asset" };
  }
};
