import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env manually
const envFile = resolve(process.cwd(), ".env");
const envContent = readFileSync(envFile, "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  let value = trimmed.slice(eqIdx + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  process.env[key] = value;
}

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const [admins, articles, projects, interviews, socials, messages, settings] = await Promise.all([
      prisma.admin.count(),
      prisma.article.count(),
      prisma.project.count(),
      prisma.interview.count(),
      prisma.socialLink.count(),
      prisma.contactMessage.count(),
      prisma.siteSetting.count(),
    ]);

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  ✅ Connected to Prisma Postgres successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`  Admins:        ${admins}`);
    console.log(`  Articles:      ${articles}`);
    console.log(`  Projects:      ${projects}`);
    console.log(`  Interviews:    ${interviews}`);
    console.log(`  Social Links:  ${socials}`);
    console.log(`  Messages:      ${messages}`);
    console.log(`  Site Settings: ${settings}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } catch (error) {
    console.error("❌ Connection failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
