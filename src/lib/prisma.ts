import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// In serverless environments (like Vercel), the deployment directory is read-only.
// Copy SQLite database to /tmp/dev.db so write operations (auth, bookings, complaints) succeed.
if (process.env.VERCEL) {
  const tmpPath = "/tmp/dev.db";
  const sourcePath = path.join(process.cwd(), "prisma", "dev.db");
  try {
    if (!fs.existsSync(tmpPath) && fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, tmpPath);
    }
    process.env.DATABASE_URL = `file:${tmpPath}`;
  } catch (err) {
    console.error("Prisma Vercel /tmp initialization error:", err);
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
