import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        dailyActivities: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json({ trips });
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Convert date strings to Date objects and remove dailyActivities
    const { dailyActivities, ...tripData } = body;
    const trip = await prisma.trip.create({
      data: {
        ...tripData,
        startDate: new Date(tripData.startDate),
        endDate: new Date(tripData.endDate),
      },
      include: {
        dailyActivities: true,
      },
    });
    
    return NextResponse.json({ trip });
  } catch (error) {
    console.error('Error creating trip:', error);
    return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    const trip = await prisma.trip.update({
      where: { id },
      data
    });
    return NextResponse.json({ trip });
  } catch (error) {
    console.error('Error updating trip:', error);
    return NextResponse.json({ error: 'Failed to update trip' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.trip.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting trip:', error);
    return NextResponse.json({ error: 'Failed to delete trip' }, { status: 500 });
  }
} 