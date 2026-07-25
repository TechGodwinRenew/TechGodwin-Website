import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing && !existing.unsubscribedAt) {
      return NextResponse.json(
        { error: 'Already subscribed' },
        { status: 409 }
      );
    }

    // If previously unsubscribed, resubscribe
    if (existing && existing.unsubscribedAt) {
      const updated = await prisma.newsletterSubscriber.update({
        where: { email },
        data: {
          unsubscribedAt: null,
          name: name || existing.name,
        },
      });
      return NextResponse.json(updated, { status: 200 });
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: { email, name },
    });

    return NextResponse.json(subscriber, { status: 201 });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email required' },
        { status: 400 }
      );
    }

    await prisma.newsletterSubscriber.update({
      where: { email },
      data: { unsubscribedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}
