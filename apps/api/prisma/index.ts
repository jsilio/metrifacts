import { PrismaClient } from "./generated/client";

export const prisma = new PrismaClient();

export default prisma;
export * from "./generated/client";
