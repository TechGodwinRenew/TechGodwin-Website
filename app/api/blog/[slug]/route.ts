import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Only return published posts in GET (or add auth check later)
    if (!post.published) {
      return NextResponse.json(
        { error: 'Post not published' },
        { status: 403 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Blog GET [slug] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const { content, ...updateData } = body;

    let data: any = updateData;

    // Recalculate reading time if content is updated
    if (content) {
      data.content = content;
      data.readingTime = calculateReadingTime(content);
    }

    const post = await prisma.blogPost.update({
      where: { slug: params.slug },
      data,
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Blog PUT [slug] error:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await prisma.blogPost.delete({
      where: { slug: params.slug },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Blog DELETE [slug] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
