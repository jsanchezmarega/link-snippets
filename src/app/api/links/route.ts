import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/links - list all links with pagination and sorting
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const tag = searchParams.get('tag');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const orderBy = searchParams.get('orderBy') || 'createdAt';
  const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';

  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  type WhereType = {
    userId?: number;
    tags?: { has: string };
  };
  const where: WhereType = {};
  if (userId) where.userId = parseInt(userId);
  if (tag) where.tags = { has: tag };

  // Get total count for pagination metadata
  const totalCount = await prisma.link.count({ where });

  const links = await prisma.link.findMany({
    where,
    orderBy: { [orderBy]: order },
    take: limit,
    skip,
    include: { user: true },
  });

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return NextResponse.json({
    links,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
  });
}

// POST /api/links - add a new link
export async function POST(req: NextRequest) {
  const data = await req.json();
  const { url, title, tags, userId } = data;
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }
  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }
  const link = await prisma.link.create({
    data: {
      url,
      title,
      tags: tags || [],
      userId: parseInt(userId),
    },
  });
  return NextResponse.json(link, { status: 201 });
}

// DELETE /api/links - delete a link by ID
export async function DELETE(req: NextRequest) {
  const data = await req.json();
  const { id } = data;
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }
  try {
    await prisma.link.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: 'Link not found' }, { status: 404 });
  }
}

// PATCH /api/links - update a link by ID
export async function PATCH(req: NextRequest) {
  const data = await req.json();
  const { id, url, title, tags } = data;
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }
  try {
    const updated = await prisma.link.update({
      where: { id },
      data: {
        url,
        title,
        tags,
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Link not found' }, { status: 404 });
  }
} 