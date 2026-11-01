import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/version';

export const runtime = 'nodejs';

export async function GET() {
  const openApiSpec = {
    openapi: '3.1.0',
    info: {
      title: 'Search Hub Cloud Node API',
      version: APP_VERSION,
      description: 'High-availability media catalog and edge aggregation gateway by Santosh Kumar (@santoshkumarvvv).',
      contact: {
        name: 'Santosh Kumar',
        url: 'https://github.com/santoshkumarvvv/search-hub-app',
      },
      license: {
        name: 'MIT',
        url: 'https://github.com/santoshkumarvvv/search-hub-app/blob/main/LICENSE',
      },
    },
    servers: [
      { url: 'https://search-hub-app.onrender.com', description: 'Production Multi-Cloud Cluster' },
    ],
    paths: {
      '/api/health': {
        get: {
          summary: 'Service Health & Cluster Telemetry Probe',
          responses: {
            '200': {
              description: 'Nominal operational status across edge shards.',
            },
          },
        },
      },
      '/api/catalog': {
        get: {
          summary: 'Query federated media catalog with circuit breaker',
          parameters: [
            { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Search term' },
            { name: 'kind', in: 'query', schema: { type: 'string', enum: ['all', 'anime', 'movie', 'tv'] } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          ],
          responses: {
            '200': { description: 'Paginated, de-duplicated media items' },
            '400': { description: 'Invalid query schema or malicious regex' },
            '429': { description: 'Rate limit exceeded' },
          },
        },
      },
    },
  };

  return NextResponse.json(openApiSpec, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Content-Type': 'application/json',
    },
  });
}
