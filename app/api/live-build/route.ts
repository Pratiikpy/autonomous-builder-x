/**
 * Live Build API - Server-Sent Events (SSE)
 */

import { NextRequest } from 'next/server';
import { LiveForgeBuilder, BuildEvent } from '@/src/agent/live-builder';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

      try {
        // Create builder with event callback
        const builder = new LiveForgeBuilder(sendEvent);

        // Start build
        await builder.buildLive(prompt);

        // Close stream
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
