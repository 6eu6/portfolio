import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/interviews — list interviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("all") === "true";

    const interviews = await db.interview.findMany({
      where: showAll ? {} : { published: true },
      orderBy: [{ sortOrder: "asc" }, { date: "desc" }],
    });

    return NextResponse.json(interviews);
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch interviews" },
      { status: 500 },
    );
  }
}

// POST /api/interviews — create a new interview
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { title, description, content, platform, platformUrl, coverImage, date, featured, published, tags, sortOrder } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Missing required field: title" },
        { status: 400 },
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
    const existing = await db.interview.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "An interview with a similar title already exists" },
        { status: 409 },
      );
    }

    const interview = await db.interview.create({
      data: {
        slug,
        title,
        description: description ?? "",
        content: content ?? "",
        platform: platform ?? "",
        platformUrl: platformUrl ?? "#",
        coverImage: coverImage ?? "",
        date: date ? new Date(date) : new Date(),
        featured: featured ?? false,
        published: published ?? true,
        tags: tags ? JSON.stringify(tags) : "[]",
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json(interview, { status: 201 });
  } catch (error) {
    console.error("Error creating interview:", error);
    return NextResponse.json(
      { error: "Failed to create interview" },
      { status: 500 },
    );
  }
}
