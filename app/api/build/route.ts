/**
 * API Route: Build Agent
 * POST /api/build
 */

import { NextRequest, NextResponse } from 'next/server';
import { MetaAgentFactory } from '@/src/agent';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Initialize factory
    const factory = new MetaAgentFactory('./public/generated-agents');

    // Build agent (stream progress)
    const result = await factory.buildAgent(prompt);

    return NextResponse.json({
      success: true,
      agent: {
        name: result.agentName,
        programId: result.programId,
        repoPath: result.repoPath.replace('./public/', '/'),
        frontendUrl: result.frontendUrl,
        documentation: result.documentation,
        buildLog: result.buildLog
      }
    });
  } catch (error: any) {
    console.error('Build error:', error);
    return NextResponse.json(
      { error: error.message || 'Build failed' },
      { status: 500 }
    );
  }
}
