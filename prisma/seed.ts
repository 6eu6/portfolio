import "dotenv/config";
import { randomUUID } from "crypto";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

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

  // Projects
  await prisma.project.createMany({
    data: [
      {
        slug: "ai-chatbot-platform",
        title: "AI Chatbot Platform",
        subtitle: "Intelligent conversational AI",
        category: "AI",
        description: "A full-stack AI chatbot platform with real-time streaming, context memory, and multi-model support.",
        longDescription: "Built with Next.js and integrated with multiple LLM providers.",
        tags: '["AI", "Next.js", "LLM", "WebSocket"]',
        year: "2025",
        status: "Completed",
        metric: "10K+ users",
        role: "Full-Stack Developer",
        team: "Solo",
        duration: "3 months",
        problem: "Users needed a unified platform to interact with different AI models.",
        solution: "Built a modular chat interface with multi-provider support.",
        features: '["Real-time streaming", "Multi-model support", "Conversation memory"]',
        outcomes: '["10K+ monthly active users", "99.9% uptime"]',
        sortOrder: 0,
      },
      {
        slug: "portfolio-3d-experience",
        title: "3D Portfolio Experience",
        subtitle: "Immersive web portfolio",
        category: "Web Development",
        description: "A visually stunning 3D portfolio with immersive scrolling and animations.",
        tags: '["Three.js", "GSAP", "Next.js", "Framer Motion"]',
        year: "2025",
        status: "In Progress",
        role: "Creative Developer",
        team: "Solo",
        duration: "Ongoing",
        problem: "Traditional portfolios lack visual impact.",
        solution: "Created an immersive 3D experience with React Three Fiber and GSAP.",
        features: '["3D scrolling", "GSAP animations", "Responsive design"]',
        outcomes: '["Unique user experience", "Award-worthy design"]',
        sortOrder: 1,
      },
    ],
  });
  console.log("  ✅ 2 projects");

  // Social links
  await prisma.socialLink.createMany({
    data: [
      {
        name: "GitHub",
        description: "Open source contributions",
        metric: "50+",
        metricLabel: "Repositories",
        url: "https://github.com/6eu6",
        icon: "Github",
        color: "#333333",
        sortOrder: 0,
      },
      {
        name: "X / Twitter",
        description: "Thoughts and updates",
        metric: "2K+",
        metricLabel: "Followers",
        url: "https://twitter.com/6eu6",
        icon: "Twitter",
        color: "#1DA1F2",
        sortOrder: 1,
      },
      {
        name: "LinkedIn",
        description: "Professional network",
        metric: "500+",
        metricLabel: "Connections",
        url: "https://linkedin.com/in/6eu6",
        icon: "Linkedin",
        color: "#0077B5",
        sortOrder: 2,
      },
      {
        name: "Email",
        description: "Get in touch",
        url: "mailto:maxok611@gmail.com",
        icon: "Mail",
        color: "#EA4335",
        sortOrder: 5,
      },
    ],
  });
  console.log("  ✅ 4 social links");

  // Interview
  await prisma.interview.create({
    data: {
      slug: "tech-talk-future-of-web",
      title: "The Future of Web Development",
      description: "Discussion about emerging web technologies and trends",
      content: "# Interview Highlights\n\nKey topics discussed include 3D web experiences, AI integration, and the evolution of frameworks.",
      platform: "Podcast",
      platformUrl: "#",
      featured: true,
      published: true,
      tags: '["Web Dev", "AI", "Future Tech"]',
      sortOrder: 0,
    },
  });
  console.log("  ✅ 1 interview");

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
