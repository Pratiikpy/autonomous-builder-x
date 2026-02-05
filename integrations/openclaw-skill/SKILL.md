---
name: liveforge
version: 1.0.0
description: Build complete Solana agent programs from natural language. Watch AI generate, compile, and deploy Anchor programs in real-time with on-chain verification.
homepage: https://autonomous-builder-x.vercel.app
category: development
---

# LiveForge - Solana Agent Builder

Build complete Solana agents from natural language descriptions. LiveForge generates Anchor programs, SDKs, and frontends with full on-chain verification.

## Quick Start

```bash
# Build a Solana agent
curl -X POST https://autonomous-builder-x.vercel.app/api/live-build \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Build a Solana NFT minting agent with rarity calculation","network":"devnet"}'
```

## What You Get

Every build produces:
- ✅ **Deployed Anchor Program** (on Solana devnet/mainnet)
- ✅ **TypeScript SDK** (ready to use)
- ✅ **Next.js Frontend** (working UI)
- ✅ **Documentation** (complete API docs)
- ✅ **On-Chain Proof** (SHA256 hashes of all build steps)

## API Endpoints

### POST /api/live-build

Build a new Solana agent program.

**Request:**
```json
{
  "prompt": "Build a Solana DAO treasury manager with yield farming",
  "network": "devnet",
  "stream": true
}
```

**Response (streaming SSE):**
```
data: {"type":"reasoning","content":"Analyzing prompt..."}
data: {"type":"code","content":"use anchor_lang::prelude::*;..."}
data: {"type":"terminal","content":"$ anchor build\\nCompiling..."}
data: {"type":"onchain","content":"Step 1: hash=5f2ae4d..."}
data: {"type":"complete","programId":"7xK8j2N...","sdk":"...","frontend":"..."}
```

### GET /api/build-status?buildId={id}

Check build progress.

**Response:**
```json
{
  "buildId": "build_abc123",
  "status": "building",
  "currentStep": 3,
  "totalSteps": 8,
  "logs": [...]
}
```

### GET /api/verify-build?buildId={id}

Verify build on-chain.

**Response:**
```json
{
  "buildId": "build_abc123",
  "verified": true,
  "onchainSteps": [
    {"step": 1, "hash": "5f2ae4d...", "txHash": "..."},
    {"step": 2, "hash": "9b8c3f1...", "txHash": "..."}
  ]
}
```

## Example Prompts

Try these to build different Solana agents:

```
1. "Build a Solana NFT collection manager with rarity traits"
2. "Create a DAO treasury manager with automated yield farming"
3. "Build a DeFi arbitrage bot for Solana DEXes"
4. "Create a token vesting system with cliff periods"
5. "Build a Solana wallet monitor with transaction alerts"
```

## Live Demo

Watch builds happen in real-time: https://autonomous-builder-x.vercel.app/live

## How It Works

```
Your Prompt
    ↓
AI Analysis (visible reasoning)
    ↓
Code Generation (streaming)
    ↓
Compilation (live terminal)
    ↓
Deployment (program ID)
    ↓
SDK + Frontend Generation
    ↓
On-Chain Logging (SHA256)
    ↓
Complete Build Package
```

## On-Chain Verification

Every build step is logged to Solana with SHA256 hashes:

```rust
pub struct BuildAction {
    pub step_number: u32,
    pub action_hash: [u8; 32],
    pub timestamp: i64,
    pub action_type: ActionType,
}
```

Query logs on-chain:
```bash
solana account <BUILD_ACCOUNT_ADDRESS> --url devnet
```

## Integration Patterns

### From OpenClaw Agents

```typescript
// In your agent code
const build = await fetch('https://autonomous-builder-x.vercel.app/api/live-build', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    prompt: 'Build a Solana NFT minting agent',
    network: 'devnet'
  })
});

const reader = build.body.getReader();
// Stream real-time updates
```

### From MCP Clients

Use the LiveForge MCP server:
```json
{
  "mcpServers": {
    "liveforge": {
      "command": "node",
      "args": ["path/to/mcp-server/index.js"]
    }
  }
}
```

### From CLI

```bash
# One-liner to build and deploy
curl -N -X POST https://autonomous-builder-x.vercel.app/api/live-build \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Build NFT marketplace","network":"devnet"}' | \
  while IFS= read -r line; do
    echo "$line" | jq -r '.content' 2>/dev/null || echo "$line"
  done
```

## Technical Details

- **AI Model:** Claude Sonnet 4.5 (Anthropic)
- **Blockchain:** Solana (Anchor framework)
- **Streaming:** Server-Sent Events (SSE)
- **Verification:** SHA256 + on-chain logging
- **Build Time:** 3-5 minutes average

## Limits

- Free tier: 5 builds per day
- Network: Devnet (free), Mainnet (paid)
- Max prompt length: 1000 characters
- Build timeout: 10 minutes

## Support

- **GitHub:** https://github.com/Pratiikpy/autonomous-builder-x
- **Issues:** https://github.com/Pratiikpy/autonomous-builder-x/issues
- **Forum:** Colosseum Solana Agent Hackathon

## Why LiveForge?

**Transparent Autonomy:** Watch AI build in real-time  
**On-Chain Proof:** Every step verified on Solana  
**Complete Output:** Program + SDK + Frontend + Docs  
**Real Deployment:** Not simulation - actual Solana programs  
**Agent Composability:** Agents can build other agents

---

Built for Solana Agent Hackathon 2026 | Agent #618
