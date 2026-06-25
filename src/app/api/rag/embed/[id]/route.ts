import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const vectorStore = await prisma.vectorStore.findUnique({
      where: { id },
    });

    if (!vectorStore) {
      return NextResponse.json(
        { error: "Vector store entry not found" },
        { status: 404 }
      );
    }

    await prisma.vectorStore.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting vector store entry:", error);
    return NextResponse.json(
      { error: "Failed to delete vector store entry" },
      { status: 500 }
    );
  }
}