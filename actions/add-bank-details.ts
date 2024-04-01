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

export const addBankDetails = async (formData: FormData) => {
  const file = await uploadPhotosToLocal(formData);
  const photos = await uploadPhotosToCloudinary(file);

  if (
    !formData ||
    !formData.get("upiid") ||
    !formData.get("accountDetails") ||
    !formData.get("upinumber") ||
    !formData.get("userId") ||
    !formData.get("ifsccode") ||
    !formData.get("name") ||
    !formData.get("bankName") ||
    !formData.get("accountType")
  ) {
    return { error: "Please fill in all required fields." };
  }

  const user = await getUserById(formData.get("userId")?.toString() as string);
  const upiid = formData.get("upiid") as string;
  const accountDetails = formData.get("accountDetails") as string;
  const upinumber = formData.get("upinumber") as string;
  try {
    if (user?.role === "ADMIN") {
      await db.bankDetails.create({
        data: {
          secure_url: photos.secure_url,
          public_id: photos.public_id,
          upiid: upiid,
          accountDetails: accountDetails,
          userId: formData.get("userId") as string,
          upinumber: upinumber,
          name: formData.get("name") as string,
          bankName: formData.get("bankName") as string,
          accountType: formData.get("accountType") as string,
          ifsccode: formData.get("ifsccode") as string,
        },
      });
    } else {
      throw new Error("Unauthorized: Only admins can add bank details.");
    }
  } catch (err: any) {
    return { error: "An error occurred. Please try again later." };
  }

  revalidatePath("/money/add");

  return { success: "Bank details added!" };
};
