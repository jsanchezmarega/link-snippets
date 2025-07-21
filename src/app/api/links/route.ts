import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/links - list all links
export async function GET() {
  const links = await prisma.link.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(links);
}

// POST /api/links - add a new link
export async function POST(req: NextRequest) {
  const data = await req.json();
  const { url, title, tags } = data;
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }
  const link = await prisma.link.create({
    data: {
      url,
      title,
      tags: tags || [],
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
  } catch (e) {
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
  } catch (e) {
    return NextResponse.json({ error: 'Link not found' }, { status: 404 });
  }
} 