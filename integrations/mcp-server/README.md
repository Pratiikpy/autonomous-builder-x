# LiveForge MCP Server

Model Context Protocol server that allows other AI agents to build Solana programs through LiveForge.

## Installation

```bash
npm install
```

## Usage

### With Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "liveforge": {
      "command": "node",
      "args": ["/path/to/integrations/mcp-server/index.js"],
      "env": {
        "LIVEFORGE_API_URL": "https://autonomous-builder-x.vercel.app"
      }
    }
  }
}
```

### With OpenClaw

```bash
export LIVEFORGE_API_URL="https://autonomous-builder-x.vercel.app"
node index.js
```

## Available Tools

### build_solana_agent

Build a complete Solana agent from natural language.

```json
{
  "prompt": "Build a Solana NFT minting agent with rarity traits",
  "network": "devnet",
  "stream": false
}
```

### get_build_status

Check build progress:

```json
{
  "buildId": "build_abc123"
}
```

### verify_build_onchain

Verify build on Solana blockchain:

```json
{
  "buildId": "build_abc123"
}
```

## Example Agent Flow

```
Agent: "I need a Solana DAO treasury manager"
  ↓
MCP Tool: build_solana_agent("Build a DAO treasury with yield farming")
  ↓
LiveForge: Builds in 3-5 minutes
  ↓
Result: Program ID, SDK, Frontend code
  ↓
Agent: Deploys and uses the new program
```

## Features

- 🔧 **3 MCP tools** - Build, status, verify
- 🚀 **Full Solana programs** - Anchor programs + SDK + frontend
- 🔗 **On-chain verification** - SHA256 hashes logged to Solana
- 📺 **Streaming support** - Watch builds in real-time
- 🤖 **Agent-to-agent** - Other agents can now build Solana programs
