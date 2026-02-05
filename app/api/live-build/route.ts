/**
 * Live Build API - Server-Sent Events (SSE)
 * Mock implementation for demo purposes
 */

import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type BuildEvent = 
  | { type: 'status'; message: string }
  | { type: 'thinking'; message: string }
  | { type: 'code'; file: string; content: string }
  | { type: 'terminal'; output: string }
  | { type: 'progress'; step: number; total: number; description: string }
  | { type: 'chain_log'; txHash: string; stepNumber: number }
  | { type: 'complete'; result: any }
  | { type: 'error'; error: string };

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();

  if (!prompt) {
    return new Response('Prompt is required', { status: 400 });
  }

  // Create a ReadableStream for Server-Sent Events
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      // Send SSE event
      const sendEvent = (event: BuildEvent) => {
        const data = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(encoder.encode(data));
      };

      const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

      try {
        // Simulate live build process
        const steps = [
          { step: 1, total: 8, description: 'Analyzing prompt...' },
          { step: 2, total: 8, description: 'Generating Anchor program...' },
          { step: 3, total: 8, description: 'Writing Rust code...' },
          { step: 4, total: 8, description: 'Compiling program...' },
          { step: 5, total: 8, description: 'Deploying to devnet...' },
          { step: 6, total: 8, description: 'Generating SDK...' },
          { step: 7, total: 8, description: 'Creating frontend...' },
          { step: 8, total: 8, description: 'Finalizing...' }
        ];

        for (const stepInfo of steps) {
          sendEvent({ type: 'progress', ...stepInfo });
          
          if (stepInfo.step === 1) {
            await sleep(500);
            sendEvent({ 
              type: 'thinking', 
              message: 'Analyzing prompt structure and identifying required Solana instructions...' 
            });
            await sleep(1000);
          }

          if (stepInfo.step === 2) {
            await sleep(500);
            sendEvent({ 
              type: 'thinking', 
              message: 'Designing program structure with PDAs and instruction handlers...' 
            });
            await sleep(800);
          }

          if (stepInfo.step === 3) {
            await sleep(300);
            sendEvent({
              type: 'code',
              file: 'programs/lib.rs',
              content: `use anchor_lang::prelude::*;

declare_id!("${generateMockProgramId()}");

#[program]
pub mod ${prompt.replace(/[^a-z0-9]/gi, '_').toLowerCase()} {
    use super::*;
    
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let account = &mut ctx.accounts.state;
        account.authority = ctx.accounts.authority.key();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 32)]
    pub state: Account<'info, StateAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct StateAccount {
    pub authority: Pubkey,
}`
            });
            await sleep(1200);
          }

          if (stepInfo.step === 4) {
            await sleep(500);
            sendEvent({ type: 'terminal', output: '$ anchor build\n' });
            await sleep(300);
            sendEvent({ type: 'terminal', output: 'Compiling solana-program v1.18.0\n' });
            await sleep(400);
            sendEvent({ type: 'terminal', output: `Compiling ${prompt.slice(0, 30)}... v0.1.0\n` });
            await sleep(600);
            sendEvent({ type: 'terminal', output: '✓ Build successful\n' });
            await sleep(500);
          }

          if (stepInfo.step === 5) {
            await sleep(500);
            sendEvent({ type: 'terminal', output: '$ anchor deploy --provider.cluster devnet\n' });
            await sleep(800);
            const programId = generateMockProgramId();
            sendEvent({ type: 'terminal', output: `Program Id: ${programId}\n` });
            await sleep(500);
            sendEvent({ type: 'terminal', output: '✓ Deploy complete!\n' });
            await sleep(300);
          }

          // Log on-chain
          const txHash = generateMockTxHash();
          sendEvent({ 
            type: 'chain_log', 
            txHash, 
            stepNumber: stepInfo.step 
          });

          await sleep(800);
        }

        // Send complete event
        const programId = generateMockProgramId();
        sendEvent({
          type: 'complete',
          result: {
            agentName: prompt.slice(0, 50),
            programId,
            buildId: `build_${Date.now()}`,
            chainProof: steps.map((_, i) => generateMockTxHash())
          }
        });

        controller.close();
      } catch (error: any) {
        sendEvent({ type: 'error', error: error.message });
        controller.close();
      }
    }
  });

  // Return SSE response
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
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

function generateMockTxHash(): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result + '...';
}
