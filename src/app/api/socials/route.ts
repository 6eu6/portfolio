import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/socials — list all social links
export async function GET() {
  try {
    const socials = await db.socialLink.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(socials);
  } catch (error) {
    console.error("Error fetching social links:", error);
    return NextResponse.json(
      { error: "Failed to fetch social links" },
      { status: 500 }
    );
  }
}

// POST /api/socials — create a new social link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, description, metric, metricLabel, url, icon, color, sortOrder } = body;

    if (!name || !url || !icon) {
      return NextResponse.json(
        { error: "Missing required fields: name, url, icon" },
        { status: 400 }
      );
    }

    const social = await db.socialLink.create({
      data: {
        name,
        description: description ?? "",
        metric: metric ?? "",
        metricLabel: metricLabel ?? "",
        url,
        icon,
        color: color ?? "#333",
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json(social, { status: 201 });
  } catch (error) {
    console.error("Error creating social link:", error);
    return NextResponse.json(
      { error: "Failed to create social link" },
      { status: 500 }
    );
  }
}
