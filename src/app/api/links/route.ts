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