import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { watchlistSchema } from "@/schemas/watchlistSchema";

// Update existing watchlist item
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { targetPrice, notes } = body;

  try {
    const updated = await prisma.watchlist.update({
      where: { id },
      data: { targetPrice, notes },
      include: { stock: true },
    });

    return NextResponse.json(watchlistSchema.parse([updated])[0]);
  } catch (err) {
    console.error("❌ Update failed:", err);
    return NextResponse.json(
      { error: "Failed to update watchlist item" },
      { status: 500 }
    );
  }
}

// Delete watchlist item
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const item = await prisma.watchlist.findUnique({ where: { id } });
    if (!item)
      return NextResponse.json({ error: "Item not found" }, { status: 404 });

    await prisma.watchlist.delete({ where: { id } });
    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("❌ Delete failed:", err);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
