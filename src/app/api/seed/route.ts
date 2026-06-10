import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects } from "@/data/projects";
import { socialPlatforms } from "@/data/social";

// POST /api/seed — seed the database from the canonical static data.
// Pass ?force=true to wipe existing projects/socials and re-seed.
export async function POST(request: NextRequest) {
  try {
    const force = request.nextUrl.searchParams.get("force") === "true";

    const existingProjects = await db.project.count();
    const existingSocials = await db.socialLink.count();

    if ((existingProjects > 0 || existingSocials > 0) && !force) {
      return NextResponse.json(
        { error: "Database already has data. Call with ?force=true to re-seed." },
        { status: 409 },
      );
    }

    if (force) {
      await db.project.deleteMany();
      await db.socialLink.deleteMany();
    }

    // ─── Seed Projects (from src/data/projects.ts) ─────────────────
    for (const [i, p] of projects.entries()) {
      await db.project.create({
        data: {
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
        },
      });
    }

    // ─── Seed Social Links (from src/data/social.ts) ───────────────
    for (const [i, s] of socialPlatforms.entries()) {
      await db.socialLink.create({
        data: {
          name: s.name,
          description: s.description,
          metric: s.metric,
          metricLabel: s.metricLabel,
          url: s.url,
          icon: s.icon,
          color: s.color,
          sortOrder: i,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      projects: projects.length,
      socials: socialPlatforms.length,
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 },
    );
  }
}
