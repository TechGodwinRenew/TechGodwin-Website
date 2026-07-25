import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, notes } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if class exists
    const upcomingClass = await prisma.upcomingClass.findUnique({
      where: { id: params.id },
    });

    if (!upcomingClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    // Check capacity
    const registrationCount = await prisma.courseRegistration.count({
      where: {
        classId: params.id,
        status: { not: 'cancelled' },
      },
    });

    if (registrationCount >= upcomingClass.capacity) {
      return NextResponse.json(
        { error: 'Class is full' },
        { status: 409 }
      );
    }

    // Check for duplicate registration
    const existing = await prisma.courseRegistration.findFirst({
      where: {
        classId: params.id,
        email,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Already registered for this class' },
        { status: 409 }
      );
    }

    // Create registration
    const registration = await prisma.courseRegistration.create({
      data: {
        classId: params.id,
        firstName,
        lastName,
        email,
        phone,
        notes,
        status: upcomingClass.isPaid ? 'pending' : 'confirmed',
        confirmedAt: upcomingClass.isPaid ? null : new Date(),
      },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error('Class register error:', error);
    return NextResponse.json(
      { error: 'Failed to register for class' },
      { status: 500 }
    );
  }
}
