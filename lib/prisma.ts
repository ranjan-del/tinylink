// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// 1. Configure Neon via PoolConfig
const poolConfig = { connectionString: process.env.DATABASE_URL! };

// 2. Pass Neon adapter -> PrismaNeon
const adapter = new PrismaNeon(poolConfig);

// 3. Create Prisma client with Neon driver
const prismaClientSingleton = () =>
  new PrismaClient({
    adapter,       
    log: ["query"],
  });

// Prevent hot reload issues
declare global {
  var prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production")
  globalThis.prismaGlobal = prisma;
