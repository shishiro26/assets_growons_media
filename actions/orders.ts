"use server";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { OrderSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";

type AssetError = {
  error: string;
};

interface OrderAsset {
  name: string;
  quantity: number;
  assetPrice: number;
}

export const addOrder = async (values: z.infer<typeof OrderSchema>) => {
  const validatedFields = OrderSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { id, price, assets } = validatedFields.data;

  const user = await getUserById(id);

  const subUser = await db.proUser.findUnique({
    where: {
      userId: id,
    },
  });

  const existingAssets = await db.asset.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const orderId = Date.now() + Math.floor(Math.random() * 100000);
  if (!user) return { error: "User not found" };
  const money = user.totalMoney;

  if (!user || user.role === "BLOCKED") {
    return { error: "You have been blocked contact admin to know more" };
  }

  const errors: AssetError[] = [];

  const allAssets = assets.map((asset) => {
    const existingAsset = existingAssets.find(
      (p) => p.assetName === asset.name
    );

    //@ts-ignore
    const proAsset = subUser?.assets?.find((pp: any) => pp.name === asset.name);

    return {
      name: asset.name,
      quantity: asset.quantity,
      stock: existingAsset?.stock ?? 0,
      minAsset: proAsset?.minAsset ?? existingAsset?.minAsset ?? 1,
      maxAsset: proAsset?.maxAsset ?? existingAsset?.maxAsset,
      price: proAsset?.price ?? existingAsset?.price,
    };
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const orders = await db.order.findMany({
    where: {
      userId: user.id,
      createdAt: {
        gte: today,
      },
      OR: [{ status: "PENDING" }, { status: "SUCCESS" }],
    },
    select: {
      assets: true,
    },
  });
  //@ts-ignore
  const allOrders: OrderAsset[] = orders.flatMap((order) => order.assets);
  const orderAssets: { name: string; totalQuantity: number }[] = [];

  allAssets.forEach((asset) => {
    const assetOrder = allOrders.filter(
      (OrderAsset) => OrderAsset.name === asset.name
    );

    if (assetOrder.length > 0) {
      const totalQuantity = assetOrder.reduce(
        (acc, curr) => acc + curr.quantity,
        0
      );
      orderAssets.push({
        name: asset.name,
        totalQuantity: totalQuantity + asset.quantity,
      });
    } else {
      orderAssets.push({
        name: asset.name,
        totalQuantity: 0 + asset.quantity,
      });
    }
  });

  allAssets.forEach((asset) => {
    if (asset.stock === 0) {
      errors.push({
        error: `${asset.name} is out of stock`,
      });
      return;
    }

    if (asset.quantity > asset.stock) {
      errors.push({
        error: `${asset.name} is stock not available`,
      });
      return;
    }

    if (user.role === "PRO") {
      if (asset.quantity < 1) {
        errors.push({
          error: `${asset.name} must be at least 1`,
        });
      }

      if (asset.quantity < asset.minAsset) {
        errors.push({
          error: `${asset.name} must be at least ${asset.minAsset} `,
        });
      }

      orderAssets.forEach((OrderAsset) => {
        if (OrderAsset.name === asset.name) {
          if (OrderAsset.totalQuantity > asset.maxAsset) {
            errors.push({
              error: `you have already ordered ${
                OrderAsset.totalQuantity - asset.quantity
              } of ${asset.name} and you can order at most ${
                asset.maxAsset
              } per day`,
            });
          }
        }
      });

      if (asset.maxAsset && asset.quantity > asset.maxAsset) {
        errors.push({
          error: `${asset.name} must be at most ${asset.maxAsset}`,
        });
      }
    } else {
      if (asset.quantity < 1) {
        errors.push({
          error: `${asset.name} must be at least 1 `,
        });
      }

      if (asset.quantity > asset.stock) {
        errors.push({
          error: `${asset.name} must be at most ${asset.stock} `,
        });
      }

      if (asset.quantity < asset.minAsset) {
        errors.push({
          error: `${asset.name} must be at least ${asset.minAsset} `,
        });
      }

      orderAssets.forEach((OrderAsset) => {
        if (OrderAsset.name === asset.name) {
          if (OrderAsset.totalQuantity > asset.maxAsset) {
            errors.push({
              error: `you have already ordered ${
                OrderAsset.totalQuantity - asset.quantity
              } of ${asset.name} and you can order at most ${
                asset.maxAsset
              } per day`,
            });
          }
        }
      });
    }
  });

  if (errors.length > 0) {
    const errorMessages = errors.map((err) => err.error).join(", ");
    return { error: errorMessages };
  }

  if (user.totalMoney === price || user.totalMoney > price) {
    try {
      const order = db.order.create({
        data: {
          userId: id,
          orderId: orderId.toString().slice(-10),
          assets: allAssets.map((asset) => ({
            name: asset.name,
            quantity: asset.quantity,
            assetPrice: asset.price,
          })),
          amount: price,
          name: user.name,
        },
      });

      const stock_updation = allAssets.forEach(async (asset) => {
        await db.asset.update({
          where: { assetName: asset.name },
          data: { stock: asset.stock - asset.quantity },
        });
      });
      const money_updation = db.user.update({
        where: {
          id,
        },
        data: {
          totalMoney: user.totalMoney - price,
        },
      });

      const walletFlow_creation = db.walletFlow.create({
        data: {
          amount: Number(price),
          moneyId: orderId.toString().slice(-10),
          purpose: "Order placed",
          userId: id,
        },
      });

      await Promise.all([
        order,
        stock_updation,
        money_updation,
        walletFlow_creation,
      ]);

      revalidatePath(`/admin/orders`);
      return { success: "Order added successfully!" };
    } catch (error) {
      return { error: "Error while adding order!" };
    }
  }

  if (user.totalMoney < price && user.role === "USER") {
    return { error: "You don't have enough money!" };
  }

  if (user.totalMoney < price && user.role === "PRO") {
    if (!subUser) {
      return { error: "You are not a proUser!" };
    }
    if (Math.sign(user.totalMoney) === -1) {
      let userTotalMoney = Math.abs(user.totalMoney);
      if (userTotalMoney + price > subUser.amount_limit) {
        console.log("You don't have enough money!");
        return { error: "You don't have enough money!" };
      }
    }
    if (Math.sign(user.totalMoney) === 1) {
      if (user.totalMoney < price) {
        if (user.totalMoney + subUser.amount_limit < price) {
          return { error: "You don't have enough money!" };
        }
      }
    }

    if (Math.sign(user.totalMoney) === 0) {
      if (price > subUser.amount_limit) {
        return { error: "You don't have enough money!" };
      }
    }
  }
  console.log("I am here");
  if (money < price && user.role === "PRO") {
    if (!subUser) {
      return { error: "You are not a proUser!" };
    }
    if (
      Math.abs(money) + subUser?.amount_limit > price ||
      Math.abs(money) + subUser?.amount_limit === price
    ) {
      try {
        const remainingPrice = money - price;
        const orderCreation = db.order.create({
          data: {
            userId: id,
            orderId: orderId.toString().slice(-10),
            assets: allAssets.map((asset) => ({
              name: asset.name,
              quantity: asset.quantity,
              assetPrice: asset.price,
            })),
            amount: price,
            name: user.name,
          },
        });

        const stock_updation = allAssets.forEach(async (asset) => {
          await db.asset.update({
            where: { assetName: asset.name },
            data: { stock: asset.stock - asset.quantity },
          });
        });

        const user_money_updation = db.user.update({
          where: {
            id: id,
          },
          data: {
            totalMoney: remainingPrice,
          },
        });

        const walletFlow_updation = db.walletFlow.create({
          data: {
            amount: Number(price),
            moneyId: orderId.toString().slice(-10),
            purpose: "Order placed",
            userId: id,
          },
        });

        await Promise.all([
          orderCreation,
          stock_updation,
          user_money_updation,
          walletFlow_updation,
        ]);
      } catch (error) {
        console.log("Error in createOrder");
      }
      revalidatePath(`/admin/orders`);
      return { success: "Order added successfully!" };
    }
  }
};
