import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function requireAuth(session: any) {
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return null;
}

// GET all posts (admin — includes drafts)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const err = requireAuth(session);
  if (err) return err;

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ posts });
}

// POST create post
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const err = requireAuth(session);
  if (err) return err;

  const body = await req.json();
  const { title, slug, excerpt, content, category, difficulty, author, tags, thumbnail, featured, published } = body;

  if (!title || !slug || !excerpt || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Check slug uniqueness
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });

  const wordCount = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200) || 1;

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      category: category || 'System Administration',
      difficulty: difficulty || 'intermediate',
      author: author || 'TechGodwin',
      tags: tags || '',
      thumbnail: thumbnail || null,
      featured: featured || false,
      published: published || false,
      readingTime,
      publishedAt: published ? new Date() : null,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
