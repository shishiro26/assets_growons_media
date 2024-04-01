"use server";
import TotalMoney from "@/app/(protected)/_components/TotalMoney";
import { db } from "@/lib/db";
import { RejectInvoiceSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";

type ValuesProps = {
  userId: string;
  invoiceId: string;
};

export const acceptInvoice = async ({ userId, invoiceId }: ValuesProps) => {
  try {
    await db.money.update({
      where: { id: invoiceId },
      data: { status: "SUCCESS" },
    });

    const money = await db.money.findUnique({
      where: {
        id: invoiceId,
      },
      select: {
        amount: true,
      },
    });

    const updatedMoney = Number(money?.amount);

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        totalMoney: true,
      },
    });

    const totalMoney = Number(user?.totalMoney);

    await db.user.update({
      where: { id: userId },
      data: {
        totalMoney: totalMoney + updatedMoney,
      },
    });
  } catch (error) {
    return { error: "Error while updating the Invoice!" };
  }

  revalidatePath("/admin/wallet");
  revalidatePath("/admin/user/");

  return { success: "Invoice accepted" };
};

export const rejectInvoice = async (
  values: z.infer<typeof RejectInvoiceSchema>
) => {
  const validatedFields = RejectInvoiceSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!!" };
  }
  try {
    await db.money.update({
      where: { id: values.id },
      data: { status: "FAILED", reason: values.reason },
    });
  } catch (error) {
    return { error: "Error while rejecting the Invoice!" };
  }
  revalidatePath("/admin/wallet");
  revalidatePath("/admin/user/");
  return { success: "Invoice rejected" };
};
