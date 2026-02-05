/**
 * Build API - Legacy endpoint (non-streaming)
 * Mock implementation for demo purposes
 */

import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();

  if (!prompt) {
    return Response.json({ error: 'Prompt is required' }, { status: 400 });
  }

  // Simulate build delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Return mock result
  const programId = generateMockProgramId();
  
  return Response.json({
    agent: {
      name: prompt.slice(0, 50),
      programId,
      frontendUrl: `https://example.com/${programId}`,
      repoPath: `/builds/${programId}`,
      documentation: `# ${prompt}\n\nGenerated Solana agent with Anchor framework.\n\n## Usage\n\n\`\`\`typescript\nimport { SolanaAgent } from './sdk';\n\nconst agent = new SolanaAgent('${programId}');\nawait agent.initialize();\n\`\`\``,
      buildLog: [
        '$ anchor build',
        'Compiling program...',
        '✓ Build successful',
        '$ anchor deploy',
        `Program deployed: ${programId}`,
        '✓ Deploy complete'
      ]
    }
  });
}

function generateMockProgramId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
  let result = '';
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
