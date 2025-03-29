import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const activity = await prisma.dailyActivity.create({
      data: {
        ...body,
        tripId: params.id,
        date: new Date(body.date),
      },
    });

    return NextResponse.json({ activity });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { error: "Failed to create activity" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const activity = await prisma.dailyActivity.update({
      where: { id: body.id },
      data: {
        title: body.title,
        description: body.description,
        location: body.location,
        date: new Date(body.date),
        time: body.time,
        notes: body.notes,
        tags: body.tags,
      },
    });

    return NextResponse.json({ activity });
  } catch (error) {
    console.error("Error updating activity:", error);
    return NextResponse.json(
      { error: "Failed to update activity" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    await prisma.dailyActivity.delete({
      where: { id: body.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting activity:", error);
    return NextResponse.json(
      { error: "Failed to delete activity" },
      { status: 500 }
    );
  }
} 