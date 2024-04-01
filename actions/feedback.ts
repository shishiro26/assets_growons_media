"use server";
import { db } from "@/lib/db";
import { FeedbackSchema, ReplySchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadFilesToLocal = async (formData: any) => {
  const image = formData.get("file");
  return image
    .arrayBuffer()
    .then((data: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) => {
      const buffer = Buffer.from(data).toString("base64");
      return buffer;
    });
};

async function uploadFilesToCloudinary(buffer: string) {
  return cloudinary.uploader.upload(
    `data:application/octet-stream;base64,${buffer}`,
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

export const addFeedback = async (formData: FormData) => {
  const orderId = formData.get("orderId")?.toString();
  const userId = formData.get("userId")?.toString();
  const feedback = formData.get("feedback")?.toString();

  if (!orderId || !userId) {
    return { error: "Invalid fields!" };
  }

  const existingFeedback = await db.feedback.findUnique({
    where: {
      orderId: orderId,
    },
  });

  if (existingFeedback) {
    return { error: "Feedback already exists!" };
  }

  if (formData.get("file") === "" && formData.get("feedback") === "") {
    return { error: "Please provide feedback or file!" };
  }

  if (formData.get("file") === "" && formData.get("feedback") !== "") {
    try {
      await db.feedback.create({
        data: {
          orderId: orderId as string,
          userId: userId as string,
          feedback: feedback as string,
        },
      });
    } catch (err) {
      console.log(err);
      return { error: "An error occurred!" };
    }
  }

  if (formData.get("feedback") === "" && formData.get("file") !== "") {
    const file = await uploadFilesToLocal(formData);
    const audio = await uploadFilesToCloudinary(file);
    try {
      await db.feedback.create({
        data: {
          orderId: orderId as string,
          userId: userId as string,
          public_id: audio.public_id,
          secure_url: audio.secure_url,
          feedback: "",
          fileName: formData.get("fileName") as string,
        },
      });
    } catch (err) {
      return { error: "An error occurred!" };
    }
  }
  if (formData.get("file") !== "" && formData.get("feedback") !== "") {
    const file = await uploadFilesToLocal(formData);
    const audio = await uploadFilesToCloudinary(file);
    try {
      await db.feedback.create({
        data: {
          orderId: orderId as string,
          userId: userId as string,
          public_id: audio.public_id,
          secure_url: audio.secure_url,
          feedback: feedback as string,
          fileName: formData.get("fileName") as string,
        },
      });
    } catch (err) {
      return { error: "An error occurred!" };
    }
  }
  return { success: "Feedback added!" };
};

export const addReply = async (values: z.infer<typeof ReplySchema>) => {
  const validatedFields = ReplySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { orderId, reply } = validatedFields.data;

  try {
    await db.feedback.update({
      where: {
        orderId: orderId,
      },
      data: {
        reply: reply,
        replyStatus: true,
      },
    });
  } catch (err) {
    console.log(err);
    return { error: "An error occurred!" };
  }

  revalidatePath("/admin/asset/asset-feedback");

  return { success: "Reply added!" };
};

export const addReplyFile = async (formData: FormData) => {
  const file = await uploadFilesToLocal(formData);
  const audio = await uploadFilesToCloudinary(file);

  const orderId = formData.get("orderId")?.toString();

  try {
    await db.feedback.update({
      where: {
        orderId: orderId,
      },
      data: {
        reply_fileName: formData.get("fileName") as string,
        reply_public_id: audio.public_id,
        reply_secure_url: audio.secure_url,
      },
    });
  } catch (err) {
    console.log(err);
    return { error: "An error occurred!" };
  }
  revalidatePath("/admin/asset/asset-feedback");
  return { success: "Reply added!" };
};
