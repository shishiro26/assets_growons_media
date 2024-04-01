"use server";
import { v2 as cloudinary } from "cloudinary";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadPhotosToLocal = async (formData: any) => {
  const image = formData.get("image");
  return image
    .arrayBuffer()
    .then((data: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) => {
      const buffer = Buffer.from(data).toString("base64");
      return buffer;
    });
};

async function uploadPhotosToCloudinary(buffer: string) {
  return cloudinary.uploader.upload(
    `data:image/png;base64,${buffer}`,
    {
      folder: "AssetsGrowonsmedia",
      resource_type: "raw",
      type: "authenticated",
    },
    (err) => {
      return { error: err?.message };
    }
  );
}

export const AddMoney = async (formData: FormData) => {
  const file = await uploadPhotosToLocal(formData);
  const photos = await uploadPhotosToCloudinary(file);

  const user = await getUserById(formData.get("userId")?.toString() ?? "");
  const username = user?.name;
  const transactionId = formData.get("transactionId")?.toString() ?? "";

  const redunctantId = await db.money.findUnique({
    where: {
      transactionId: transactionId,
    },
  });

  if (redunctantId) {
    return { error: "This transaction ID already exists" };
  }

  try {
    if (user?.role === "BLOCKED") {
      return {
        error: "You have been blocked by the admin. contact admin know more",
      };
    }

    await db.money.create({
      data: {
        amount: formData.get("amount")?.toString(),
        secure_url: photos.secure_url,
        public_id: photos.public_id,
        transactionId: formData.get("transactionId")?.toString() ?? "",
        upiid: formData.get("upiid")?.toString() ?? "",
        accountNumber: formData.get("accountNumber")?.toString(),
        userId: formData.get("userId")?.toString(),
        name: username ?? "",
      },
    });

    await db.walletFlow.create({
      data: {
        amount: Number(formData.get("amount")),
        moneyId: formData.get("transactionId") as string,
        purpose: "Wallet recharge",
        userId: formData.get("userId") as string,
      },
    });
  } catch (err: any) {
    console.log(err);
    return { error: "an error occurred. please try again later" };
  }

  revalidatePath("/money/record");

  return { success: "Money added!" };
};
