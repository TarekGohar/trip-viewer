import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

async function checkTripOwnership(tripId: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    return { error: "Unauthorized", status: 401 };
  }

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { userId: true },
  });

  if (!trip || trip.userId !== userId) {
    return { error: "Forbidden", status: 403 };
  }

  return null;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: tripId } = await params;
    const authError = await checkTripOwnership(tripId);
    if (authError) {
      return NextResponse.json(
        { error: authError.error },
        { status: authError.status }
      );
    }

    const body = await request.json();
    const activity = await prisma.dailyActivity.create({
      data: {
        ...body,
        tripId,
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
    const { id: tripId } = await params;
    const authError = await checkTripOwnership(tripId);
    if (authError) {
      return NextResponse.json(
        { error: authError.error },
        { status: authError.status }
      );
    }

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
    const { id: tripId } = await params;
    const authError = await checkTripOwnership(tripId);
    if (authError) {
      return NextResponse.json(
        { error: authError.error },
        { status: authError.status }
      );
    }

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