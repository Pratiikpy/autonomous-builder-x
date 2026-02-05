/**
 * Build Detail API - Get individual build by ID
 */

import { NextRequest } from 'next/server';
import { getBuild } from '@/lib/buildStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const buildId = params.id;
    const build = getBuild(buildId);

    if (!build) {
      return Response.json(
        { error: 'Build not found', buildId },
        { status: 404 }
      );
    }

    return Response.json(build);
  } catch (error: any) {
    console.error('Error fetching build:', error);
    return Response.json(
      { error: 'Failed to fetch build', details: error.message },
      { status: 500 }
    );
  }
}
