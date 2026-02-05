import { NextResponse } from 'next/server';
import { getAllBuilds } from '@/lib/buildStore';

export async function GET() {
  try {
    const builds = getAllBuilds();
    
    const totalBuilds = builds.length;
    const successfulBuilds = builds.filter(b => b.status === 'success').length;
    const successRate = totalBuilds > 0 
      ? ((successfulBuilds / totalBuilds) * 100).toFixed(1)
      : '0.0';
    
    // Calculate average build time
    let totalSeconds = 0;
    let countWithDuration = 0;
    
    builds.forEach(build => {
      if (build.duration) {
        const match = build.duration.match(/(\d+)m\s*(\d+)s/);
        if (match) {
          const minutes = parseInt(match[1]);
          const seconds = parseInt(match[2]);
          totalSeconds += minutes * 60 + seconds;
          countWithDuration++;
        }
      }
    });
    
    const avgSeconds = countWithDuration > 0 ? totalSeconds / countWithDuration : 0;
    const avgMinutes = Math.floor(avgSeconds / 60);
    const avgSecondsRem = Math.floor(avgSeconds % 60);
    const avgBuildTime = `${avgMinutes}m ${avgSecondsRem}s`;
    
    // Count on-chain proofs
    const totalProofs = builds.reduce((sum, b) => sum + b.chainProofs.length, 0);
    
    return NextResponse.json({
      totalBuilds,
      successRate,
      avgBuildTime,
      totalProofs,
    });
  } catch (error: any) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
