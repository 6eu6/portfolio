import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// GET /api/projects/[id] — get a single project by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await db.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] — update a project by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  try {
    const { id } = await params;

    const existing = await db.project.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

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

    const project = await db.project.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(category && { category }),
        ...(description && { description }),
        ...(longDescription !== undefined && { longDescription }),
        ...(tags !== undefined && { tags: JSON.stringify(tags) }),
        ...(year && { year }),
        ...(status && { status }),
        ...(metric !== undefined && { metric }),
        ...(role !== undefined && { role }),
        ...(team !== undefined && { team }),
        ...(duration !== undefined && { duration }),
        ...(problem !== undefined && { problem }),
        ...(solution !== undefined && { solution }),
        ...(features !== undefined && { features: JSON.stringify(features) }),
        ...(outcomes !== undefined && { outcomes: JSON.stringify(outcomes) }),
        ...(lessons !== undefined && { lessons }),
        ...(liveUrl !== undefined && { liveUrl }),
        ...(sourceUrl !== undefined && { sourceUrl }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] — delete a project by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  try {
    const { id } = await params;

    const project = await db.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    await db.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
