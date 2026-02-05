#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const LIVEFORGE_API = process.env.LIVEFORGE_API_URL || 'https://autonomous-builder-x.vercel.app';

const server = new Server(
  {
    name: 'liveforge-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'build_solana_agent',
        description: 'Build a complete Solana agent program from natural language description. Returns deployed program ID, SDK, and frontend code.',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: 'Natural language description of the Solana agent to build',
            },
            network: {
              type: 'string',
              enum: ['devnet', 'mainnet'],
              default: 'devnet',
              description: 'Solana network to deploy to',
            },
            stream: {
              type: 'boolean',
              default: false,
              description: 'Whether to stream build progress',
            },
          },
          required: ['prompt'],
        },
      },
      {
        name: 'get_build_status',
        description: 'Check the status of an ongoing or completed LiveForge build',
        inputSchema: {
          type: 'object',
          properties: {
            buildId: {
              type: 'string',
              description: 'The build ID to check status for',
            },
          },
          required: ['buildId'],
        },
      },
      {
        name: 'verify_build_onchain',
        description: 'Verify that a build was logged on-chain with SHA256 hashes',
        inputSchema: {
          type: 'object',
          properties: {
            buildId: {
              type: 'string',
              description: 'The build ID to verify on-chain',
            },
          },
          required: ['buildId'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'build_solana_agent': {
      try {
        const response = await fetch(`${LIVEFORGE_API}/api/live-build`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: args.prompt,
            network: args.network || 'devnet',
          }),
        });

        if (!response.ok) {
          throw new Error(`LiveForge API error: ${response.statusText}`);
        }

        if (args.stream) {
          // Return streaming response
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let result = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            result += decoder.decode(value, { stream: true });
          }

          return {
            content: [
              {
                type: 'text',
                text: result,
              },
            ],
          };
        } else {
          const data = await response.json();
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(data, null, 2),
              },
            ],
          };
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }

    case 'get_build_status': {
      try {
        const response = await fetch(
          `${LIVEFORGE_API}/api/build-status?buildId=${args.buildId}`
        );
        const data = await response.json();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }

    case 'verify_build_onchain': {
      try {
        const response = await fetch(
          `${LIVEFORGE_API}/api/verify-build?buildId=${args.buildId}`
        );
        const data = await response.json();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('LiveForge MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
