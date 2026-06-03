import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const rows = await prisma.siteSetting.findMany();
  console.log("Existing SiteSettings:", JSON.stringify(rows, null, 2));
  await prisma.$disconnect();
}

main();
