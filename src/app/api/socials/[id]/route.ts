import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// GET /api/socials/[id] — get a single social link by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const social = await db.socialLink.findUnique({
      where: { id },
    });

    if (!social) {
      return NextResponse.json(
        { error: "Social link not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(social);
  } catch (error) {
    console.error("Error fetching social link:", error);
    return NextResponse.json(
      { error: "Failed to fetch social link" },
      { status: 500 }
    );
  }
}

// PUT /api/socials/[id] — update a social link by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  try {
    const { id } = await params;

    const existing = await db.socialLink.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Social link not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const { name, description, metric, metricLabel, url, icon, color, sortOrder } = body;

    const social = await db.socialLink.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(metric !== undefined && { metric }),
        ...(metricLabel !== undefined && { metricLabel }),
        ...(url && { url }),
        ...(icon && { icon }),
        ...(color !== undefined && { color }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return NextResponse.json(social);
  } catch (error) {
    console.error("Error updating social link:", error);
    return NextResponse.json(
      { error: "Failed to update social link" },
      { status: 500 }
    );
  }
}

// DELETE /api/socials/[id] — delete a social link by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  try {
    const { id } = await params;

    const social = await db.socialLink.findUnique({
      where: { id },
    });

    if (!social) {
      return NextResponse.json(
        { error: "Social link not found" },
        { status: 404 }
      );
    }

    await db.socialLink.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("Error deleting social link:", error);
    return NextResponse.json(
      { error: "Failed to delete social link" },
      { status: 500 }
    );
  }
}
