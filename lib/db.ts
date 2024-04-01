import { PrismaClient } from "@prisma/client";

declare const global: Global & { prisma?: PrismaClient };

export let db: PrismaClient;

if (typeof window === "undefined") {
  if (process.env["NODE_ENV"] === "production") {
    db = new PrismaClient();
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    db = global.prisma;
  }
}
