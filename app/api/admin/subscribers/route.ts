import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const total = await prisma.newsletterSubscriber.count({
    where: { unsubscribedAt: null },
  });

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { unsubscribedAt: null },
    orderBy: { subscribedAt: 'desc' },
    take: 50,
  });

  return NextResponse.json({ total, subscribers });
}
