import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PUT /api/contacts/[id] — toggle read status
export async function PUT(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const messageId = parseInt(id, 10);

    if (isNaN(messageId)) {
      return NextResponse.json(
        { error: "Invalid contact message ID" },
        { status: 400 }
      );
    }

    const existing = await db.contactMessage.findUnique({
      where: { id: messageId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Contact message not found" },
        { status: 404 }
      );
    }

    const message = await db.contactMessage.update({
      where: { id: messageId },
      data: { read: !existing.read },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error updating contact message:", error);
    return NextResponse.json(
      { error: "Failed to update contact message" },
      { status: 500 }
    );
  }
}

// DELETE /api/contacts/[id] — delete a contact message
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const messageId = parseInt(id, 10);

    if (isNaN(messageId)) {
      return NextResponse.json(
        { error: "Invalid contact message ID" },
        { status: 400 }
      );
    }

    const message = await db.contactMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return NextResponse.json(
        { error: "Contact message not found" },
        { status: 404 }
      );
    }

    await db.contactMessage.delete({
      where: { id: messageId },
    });

    return NextResponse.json({ success: true, deletedId: messageId });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    return NextResponse.json(
      { error: "Failed to delete contact message" },
      { status: 500 }
    );
  }
}
