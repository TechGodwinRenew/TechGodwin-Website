import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function requireAuth(session: any) {
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return null;
}

// GET single post by id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const err = requireAuth(session);
  if (err) return err;

  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

// PUT full update
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const err = requireAuth(session);
  if (err) return err;

  const body = await req.json();
  const { title, slug, excerpt, content, category, difficulty, author, tags, thumbnail, featured, published } = body;

  const wordCount = content?.replace(/<[^>]+>/g, '').split(/\s+/).length || 0;
  const readingTime = Math.ceil(wordCount / 200) || 1;

  const current = await prisma.blogPost.findUnique({ where: { id: params.id } });
  const wasPublished = current?.published;

  const post = await prisma.blogPost.update({
    where: { id: params.id },
    data: {
      title,
      slug,
      excerpt,
      content,
      category,
      difficulty,
      author,
      tags,
      thumbnail: thumbnail || null,
      featured,
      published,
      readingTime,
      publishedAt: published && !wasPublished ? new Date() : undefined,
    },
  });

  return NextResponse.json(post);
}

// PATCH partial update (toggle published, etc.)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const err = requireAuth(session);
  if (err) return err;

  const body = await req.json();
  const post = await prisma.blogPost.update({
    where: { id: params.id },
    data: {
      ...body,
      ...(body.published === true ? { publishedAt: new Date() } : {}),
    },
  });

  return NextResponse.json(post);
}

// DELETE post
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const err = requireAuth(session);
  if (err) return err;

  await prisma.blogPost.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
