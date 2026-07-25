import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const upcoming = searchParams.get('upcoming') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: any = { published: true };
    if (upcoming) {
      where.startDate = { gt: new Date() };
    }

    const [classes, total] = await Promise.all([
      prisma.upcomingClass.findMany({
        where,
        orderBy: { startDate: 'asc' },
        skip,
        take: limit,
        include: {
          registrations: {
            where: { status: 'confirmed' },
            select: { id: true },
          },
        },
      }),
      prisma.upcomingClass.count({ where }),
    ]);

    // Add registration count to response
    const classesWithCount = classes.map((c) => ({
      ...c,
      registeredCount: c.registrations.length,
      registrations: undefined,
    }));

    return NextResponse.json({
      classes: classesWithCount,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Classes GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      startDate,
      endDate,
      duration,
      instructor,
      location,
      capacity = 30,
      price = 0,
      isPaid = false,
      published = false,
    } = body;

    if (!title || !description || !category || !startDate || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const upcomingClass = await prisma.upcomingClass.create({
      data: {
        title,
        description,
        category,
        startDate: new Date(startDate),
        endDate: new Date(endDate || startDate),
        duration,
        instructor,
        location,
        capacity,
        price,
        isPaid,
        published,
      },
    });

    return NextResponse.json(upcomingClass, { status: 201 });
  } catch (error) {
    console.error('Classes POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create class' },
      { status: 500 }
    );
  }
}
