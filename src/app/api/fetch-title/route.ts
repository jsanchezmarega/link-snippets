import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Fetch the webpage
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkSnippets/1.0)',
      },
      // Add timeout
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch page' }, { status: 400 });
    }

    const html = await response.text();
    
    // Extract title from HTML
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;

    // Fallback: try to extract from meta tags
    if (!title) {
      const metaTitleMatch = html.match(/<meta[^>]*name=["']title["'][^>]*content=["']([^"']+)["']/i);
      if (metaTitleMatch) {
        return NextResponse.json({ title: metaTitleMatch[1].trim() });
      }
    }

    return NextResponse.json({ title });
  } catch (error) {
    console.error('Error fetching title:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page title' },
      { status: 500 }
    );
  }
} 