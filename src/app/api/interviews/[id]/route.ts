import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// GET /api/interviews/[id] — get a single interview by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const interview = await db.interview.findUnique({
      where: { id },
    });

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(interview);
  } catch (error) {
    console.error("Error fetching interview:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview" },
      { status: 500 },
    );
  }
}

// PUT /api/interviews/[id] — update an interview by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  try {
    const { id } = await params;

    const existing = await db.interview.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 },
      );
    }

    const body = await request.json();

    const {
      title, description, content, platform, platformUrl, coverImage,
      date, featured, published, tags, sortOrder,
    } = body;

    const interview = await db.interview.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(content !== undefined && { content }),
        ...(platform !== undefined && { platform }),
        ...(platformUrl !== undefined && { platformUrl }),
        ...(coverImage !== undefined && { coverImage }),
        ...(date && { date: new Date(date) }),
        ...(featured !== undefined && { featured }),
        ...(published !== undefined && { published }),
        ...(tags !== undefined && { tags: JSON.stringify(tags) }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return NextResponse.json(interview);
  } catch (error) {
    console.error("Error updating interview:", error);
    return NextResponse.json(
      { error: "Failed to update interview" },
      { status: 500 },
    );
  }
}

// DELETE /api/interviews/[id] — delete an interview by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  try {
    const { id } = await params;

    const interview = await db.interview.findUnique({
      where: { id },
    });

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 },
      );
    }

    await db.interview.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("Error deleting interview:", error);
    return NextResponse.json(
      { error: "Failed to delete interview" },
      { status: 500 },
    );
  }
}
