import "dotenv/config";
import { randomUUID } from "crypto";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { projects } from "../src/data/projects";
import { socialPlatforms } from "../src/data/social";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data (order matters for FKs)
  await prisma.contactMessage.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.interview.deleteMany();
  await prisma.project.deleteMany();
  await prisma.article.deleteMany();
  await prisma.admin.deleteMany();
  console.log("  🧹 Cleaned existing data");

  // Admin user
  const admin = await prisma.admin.create({
    data: {
      email: "admin@portfolio.dev",
      name: "Admin",
      password: "admin123",
      role: "admin",
    },
  });
  console.log("  ✅ Admin:", admin.email);

  // Articles
  await prisma.article.createMany({
    data: [
      {
        slug: "building-3d-portfolios-with-nextjs",
        title: "Building 3D Portfolios with Next.js",
        subtitle: "A deep dive into immersive web experiences",
        content: "# Building 3D Portfolios\n\nCreating immersive 3D web experiences requires the right combination of technologies...",
        category: "Development",
        excerpt: "Learn how to create stunning 3D portfolio websites using Next.js, React Three Fiber, and GSAP.",
        readTime: "8 min",
        featured: true,
        published: true,
        tags: '["Next.js", "Three.js", "WebGL", "GSAP"]',
      },
      {
        slug: "design-principles-for-developers",
        title: "Design Principles for Developers",
        subtitle: "Bridging the gap between code and design",
        content: "# Design Principles\n\nGood design isn't just about aesthetics...",
        category: "Design",
        excerpt: "Essential design principles every developer should know to create beautiful interfaces.",
        readTime: "5 min",
        tags: '["Design", "UI/UX", "CSS"]',
      },
    ],
  });
  console.log("  ✅ 2 articles");

  // Projects — from the canonical static data (src/data/projects.ts)
  await prisma.project.createMany({
    data: projects.map((p, i) => ({
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle,
      category: p.category,
      description: p.description,
      longDescription: p.longDescription,
      coverImage: p.coverImage,
      tags: JSON.stringify(p.tags),
      year: p.year,
      status: p.status,
      metric: p.metric,
      role: p.role,
      team: p.team,
      duration: p.duration,
      problem: p.problem,
      solution: p.solution,
      features: JSON.stringify(p.features),
      outcomes: JSON.stringify(p.outcomes),
      lessons: p.lessons,
      liveUrl: p.liveUrl,
      sourceUrl: p.sourceUrl,
      sortOrder: i,
    })),
  });
  console.log(`  ✅ ${projects.length} projects`);

  // Social links — from the canonical static data (src/data/social.ts)
  await prisma.socialLink.createMany({
    data: socialPlatforms.map((s, i) => ({
      name: s.name,
      description: s.description,
      metric: s.metric,
      metricLabel: s.metricLabel,
      url: s.url,
      icon: s.icon,
      color: s.color,
      sortOrder: i,
    })),
  });
  console.log(`  ✅ ${socialPlatforms.length} social links`);

  // Site settings (use sequential create with explicit UUIDs)
  await prisma.siteSetting.create({ data: { id: randomUUID(), key: "site_title", value: "Portfolio" } });
  await prisma.siteSetting.create({ data: { id: randomUUID(), key: "site_description", value: "Creative Developer & Designer" } });
  await prisma.siteSetting.create({ data: { id: randomUUID(), key: "hero_name", value: "6eu6" } });
  await prisma.siteSetting.create({ data: { id: randomUUID(), key: "hero_role", value: "Creative Developer" } });
  console.log("  ✅ 4 site settings");

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
