import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/seed — seed the database with initial projects and social links
export async function POST(_request: NextRequest) {
  try {
    // Check if data already exists
    const existingProjects = await db.project.count();
    if (existingProjects > 0) {
      return NextResponse.json(
        { error: "Database already contains projects. Clear data first if you want to re-seed." },
        { status: 409 }
      );
    }

    const existingSocials = await db.socialLink.count();
    if (existingSocials > 0) {
      return NextResponse.json(
        { error: "Database already contains social links. Clear data first if you want to re-seed." },
        { status: 409 }
      );
    }

    // Seed Projects
    const projectsData = [
      {
        slug: "atlas-analytics",
        title: "Atlas Analytics",
        subtitle: "",
        category: "AI",
        description: "A calm analytics platform turning scattered data into decisions with forecasts, alerts, and live dashboards.",
        longDescription: "Atlas Analytics is a unified analytics platform designed to help teams make faster, more accurate decisions.",
        tags: JSON.stringify(["Python", "FastAPI", "PostgreSQL", "React", "Chart.js", "Redis"]),
        year: "2024",
        status: "In Production",
        metric: "34% accuracy lift",
        role: "Product Lead / Full-stack",
        team: "3 engineers, 1 designer",
        duration: "6 months",
        problem: "Teams were working with fragmented data across spreadsheets and dashboards.",
        solution: "Built a unified analytics platform with automated data pipelines and AI-powered forecasting.",
        features: JSON.stringify(["Real-time dashboards", "AI-powered forecasting", "Automated report generation", "Configurable alerts", "Data source integration", "Export capabilities"]),
        outcomes: JSON.stringify(["34% improvement in forecast accuracy", "62% faster report generation", "120+ active dashboards", "99.9% uptime SLA", "Reduced manual data work by 40%"]),
        lessons: "Invest heavily in the data layer before building UI.",
        liveUrl: "#",
        sourceUrl: "#",
        sortOrder: 1,
      },
      {
        slug: "neonpay",
        title: "NeonPay",
        subtitle: "Payment Infrastructure",
        category: "FinTech",
        description: "Payment infrastructure concept with settlement flows, wallet routing, and risk checks.",
        longDescription: "",
        tags: JSON.stringify(["Next.js", "Node.js", "PostgreSQL", "Stripe", "Redis"]),
        year: "2024",
        status: "Prototype",
        metric: "12 flows mapped",
        role: "Product / Architecture",
        team: "2 engineers",
        duration: "3 months",
        problem: "",
        solution: "",
        features: JSON.stringify(["Multi-processor routing", "Real-time settlement tracking", "Risk scoring engine", "Merchant analytics", "Compliance audit trails", "Webhook management"]),
        outcomes: JSON.stringify(["12 payment flows mapped", "85% routing accuracy", "Processing time <200ms", "98% compliance coverage"]),
        lessons: "Payment systems require extreme attention to edge cases.",
        liveUrl: "#",
        sourceUrl: "#",
        sortOrder: 2,
      },
      {
        slug: "aether-ai",
        title: "Aether AI",
        subtitle: "Multi-Tool AI Assistant",
        category: "AI",
        description: "",
        longDescription: "",
        tags: JSON.stringify(["LangChain", "OpenAI", "Pinecone", "React", "Python"]),
        year: "2024",
        status: "Experiment",
        metric: "9 agents active",
        role: "Lead Developer / Researcher",
        team: "Solo + advisor",
        duration: "4 months",
        problem: "",
        solution: "",
        features: JSON.stringify(["Multi-agent orchestration", "Persistent memory", "RAG with knowledge bases", "Workflow templates", "Human review checkpoints", "Tool marketplace"]),
        outcomes: JSON.stringify(["9 active agents", "73% task completion rate", "Memory retention across 500+ sessions", "Open-sourced core framework"]),
        lessons: "The hardest part of AI systems is orchestration and state management.",
        liveUrl: "#",
        sourceUrl: "#",
        sortOrder: 3,
      },
      {
        slug: "builder-cli",
        title: "Builder CLI",
        subtitle: "Developer Workflow Toolkit",
        category: "Developer Tools",
        description: "",
        longDescription: "",
        tags: JSON.stringify(["Go", "Docker", "GitHub Actions", "YAML"]),
        year: "2023",
        status: "Active",
        metric: "2.5k hours saved",
        role: "Creator / Maintainer",
        team: "Solo + community",
        duration: "Ongoing",
        problem: "",
        solution: "",
        features: JSON.stringify(["Project scaffolding with 20+ templates", "Environment management", "Deployment configs", "Code quality gates", "Plugin ecosystem", "Team config sharing"]),
        outcomes: JSON.stringify(["2,500+ developer hours saved", "150+ projects scaffolded", "40+ community templates", "Adopted by 8 teams"]),
        lessons: "Developer tools succeed when they reduce cognitive load.",
        liveUrl: "#",
        sourceUrl: "#",
        sortOrder: 4,
      },
      {
        slug: "content-os",
        title: "Content OS",
        subtitle: "Editorial Operating System",
        category: "Content Systems",
        description: "",
        longDescription: "",
        tags: JSON.stringify(["Sanity", "Next.js", "Vercel", "Resend"]),
        year: "2023",
        status: "Live",
        metric: "50+ essays published",
        role: "Creator / Writer",
        team: "Solo",
        duration: "Ongoing",
        problem: "",
        solution: "",
        features: JSON.stringify(["Idea capture with tagging", "Draft management pipeline", "Publishing calendar", "Newsletter integration", "Performance analytics", "Cross-platform publishing"]),
        outcomes: JSON.stringify(["50+ essays published", "Pipeline reduced from 3 days to 3 hours", "Newsletter open rate: 42%", "Consistent publishing cadence"]),
        lessons: "Content systems should reduce friction, not add it.",
        liveUrl: "#",
        sourceUrl: "#",
        sortOrder: 5,
      },
      {
        slug: "dataflow-studio",
        title: "DataFlow Studio",
        subtitle: "Visual ETL Builder",
        category: "SaaS",
        description: "",
        longDescription: "",
        tags: JSON.stringify(["Airflow", "Python", "Redis", "React", "Docker"]),
        year: "2023",
        status: "Beta",
        metric: "120 jobs running",
        role: "Technical Lead",
        team: "4 engineers",
        duration: "8 months",
        problem: "",
        solution: "",
        features: JSON.stringify(["Visual pipeline designer", "Code editor at each step", "120+ connectors", "Scheduled jobs", "Audit logging", "Real-time monitoring"]),
        outcomes: JSON.stringify(["120 jobs in production", "Pipeline build time -60%", "99.7% job success rate", "3x faster onboarding"]),
        lessons: "Visual tools need to handle edge cases gracefully.",
        liveUrl: "#",
        sourceUrl: "#",
        sortOrder: 6,
      },
    ];

    for (const project of projectsData) {
      await db.project.create({ data: project });
    }

    // Seed Social Links
    const socialsData = [
      {
        name: "GitHub",
        description: "Open source projects and developer tools",
        metric: "120+",
        metricLabel: "Repos",
        url: "https://github.com",
        icon: "Github",
        color: "#333",
        sortOrder: 1,
      },
      {
        name: "Telegram",
        description: "Private channel with notes and resources",
        metric: "2.1K+",
        metricLabel: "Members",
        url: "https://t.me",
        icon: "Send",
        color: "#229ED9",
        sortOrder: 2,
      },
      {
        name: "X / Twitter",
        description: "Short ideas, threads, and progress updates",
        metric: "3.2K+",
        metricLabel: "Followers",
        url: "https://x.com",
        icon: "Twitter",
        color: "#000",
        sortOrder: 3,
      },
      {
        name: "LinkedIn",
        description: "Professional insights and collaborations",
        metric: "1.8K+",
        metricLabel: "Network",
        url: "https://linkedin.com",
        icon: "Linkedin",
        color: "#0A66C2",
        sortOrder: 4,
      },
      {
        name: "YouTube",
        description: "Tutorials, case studies, and walkthroughs",
        metric: "12K+",
        metricLabel: "Views",
        url: "https://youtube.com",
        icon: "Youtube",
        color: "#FF0000",
        sortOrder: 5,
      },
      {
        name: "Newsletter",
        description: "Essays, frameworks, and curated resources",
        metric: "2.5K+",
        metricLabel: "Subscribers",
        url: "#",
        icon: "Mail",
        color: "#8FB7A6",
        sortOrder: 6,
      },
    ];

    for (const social of socialsData) {
      await db.socialLink.create({ data: social });
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      projectsCreated: projectsData.length,
      socialsCreated: socialsData.length,
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
