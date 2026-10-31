import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(
    {
      status: 'nominal',
      service: 'search-hub-cloud-node',
      version: '2.4.0',
      timestamp: new Date().toISOString(),
      providers: {
        jikan: 'connected',
        tmdb: process.env.TMDB_API_KEY ? 'configured' : 'fallback-active',
      },
      slaTarget: '99.95%',
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
      },
    }
  );
}
