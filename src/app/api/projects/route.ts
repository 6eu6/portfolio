import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/projects — list all projects
export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects — create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      title,
      subtitle,
      category,
      description,
      longDescription,
      tags,
      year,
      status,
      metric,
      role,
      team,
      duration,
      problem,
      solution,
      features,
      outcomes,
      lessons,
      liveUrl,
      sourceUrl,
      sortOrder,
    } = body;

    if (!title || !category || !description) {
      return NextResponse.json(
        { error: "Missing required fields: title, category, description" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    // Check for duplicate slug
    const existing = await db.project.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A project with a similar title already exists" },
        { status: 409 }
      );
    }

    const project = await db.project.create({
      data: {
        slug,
        title,
        subtitle: subtitle ?? "",
        category,
        description,
        longDescription: longDescription ?? "",
        tags: tags ? JSON.stringify(tags) : "[]",
        year: year ?? new Date().getFullYear().toString(),
        status: status ?? "In Progress",
        metric: metric ?? "",
        role: role ?? "",
        team: team ?? "",
        duration: duration ?? "",
        problem: problem ?? "",
        solution: solution ?? "",
        features: features ? JSON.stringify(features) : "[]",
        outcomes: outcomes ? JSON.stringify(outcomes) : "[]",
        lessons: lessons ?? "",
        liveUrl: liveUrl ?? "#",
        sourceUrl: sourceUrl ?? "#",
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
