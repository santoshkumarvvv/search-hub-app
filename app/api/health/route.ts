import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/version';

export const runtime = 'nodejs';

export async function GET() {
  const tmdbActive = Boolean(process.env.TMDB_API_KEY);

  return NextResponse.json(
    {
      status: 'nominal',
      service: 'search-hub-cloud-node',
      version: APP_VERSION,
      timestamp: new Date().toISOString(),
      providers: {
        jikan: 'connected',
        tmdb: tmdbActive ? 'configured' : 'fallback-active',
      },
      tmdbConfigured: tmdbActive,
      slaTarget: '99.95%',
      notice: tmdbActive
        ? undefined
        : 'TMDB_API_KEY is not configured in environment. The catalog is running in resilient fallback mode (Anime feed live, movies/TV in offline mock seed mode). To enable live TMDB, define TMDB_API_KEY.',
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
