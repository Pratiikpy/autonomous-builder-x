/**
 * Builds API - List all builds
 * Returns build history from shared build store
 */

import { NextRequest } from 'next/server';
import { getAllBuilds } from '@/lib/buildStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const builds = getAllBuilds();

    return Response.json({
      builds,
      total: builds.length,
      success: builds.filter(b => b.status === 'success').length,
      failed: builds.filter(b => b.status === 'failed').length,
      inProgress: builds.filter(b => b.status === 'in_progress').length
    });
  } catch (error: any) {
    console.error('Error fetching builds:', error);
    return Response.json(
      { error: 'Failed to fetch builds', details: error.message },
      { status: 500 }
    );
  }
}
