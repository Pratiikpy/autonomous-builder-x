# LiveForge SDK Examples

Three examples showing how to programmatically build Solana agents with LiveForge.

## Prerequisites

```bash
npm install @solana/web3.js
```

## Examples

### 1. Basic Build (`1-basic-build.ts`)

Build a simple Solana agent and get the deployed program ID.

```bash
npx tsx 1-basic-build.ts
```

**Output:**
```
🚀 Starting basic build...
🤖 AI: Analyzing prompt...
💻 $ anchor build
💻 Compiling...
✅ Build complete!
📍 Program ID: 7xK8j2N...
```

### 2. Verify On-Chain (`2-verify-onchain.ts`)

Build an agent and verify all steps were logged on-chain with SHA256 hashes.

```bash
npx tsx 2-verify-onchain.ts
```

**Output:**
```
🚀 Building Solana agent with verification...
✅ Build complete: build_abc123
🔍 Verifying on-chain...
✅ On-chain verification successful!

Build steps logged on Solana:
  1. Analyze
     Hash: 5f2ae4d...
     TX: abc123...
  2. GenerateCode
     Hash: 9b8c3f1...
     TX: def456...
...
```

### 3. Agent-to-Agent (`3-agent-to-agent.ts`)

Meta-agent that builds specialized sub-agents on demand.

```bash
npx tsx 3-agent-to-agent.ts
```

**Output:**
```
🚀 Meta-Agent: Orchestrating multi-agent build...
Tasks to build: 3

🤖 Meta-Agent: Building sub-agent for "Detect arbitrage opportunities"
  💭 Analyzing DEX monitoring requirements...
  ✅ Sub-agent deployed: 7xK8j...
✅ Arbitrage Monitor ready

🤖 Meta-Agent: Building sub-agent for "Optimize DAO treasury returns"
  💭 Designing yield farming strategies...
  ✅ Sub-agent deployed: 9mL3p...
✅ Treasury Manager ready

🎉 All sub-agents built and deployed!
```

## Use Cases

### Example 1: Quick Prototyping
- Build a Solana program in minutes
- Test ideas without writing Rust
- Get working code immediately

### Example 2: Audit Trail
- Verify every build step on-chain
- Prove autonomous development occurred
- SHA256 hashes prevent tampering
- Transparent build process

### Example 3: Multi-Agent Systems
- One meta-agent builds specialized sub-agents
- Each sub-agent handles specific tasks
- Coordinated agent fleets
- Recursive autonomy

## Integration Patterns

### In Your Own Agent

```typescript
import { LiveForge } from './liveforge-sdk';

class MyAgent {
  async needsNewCapability(description: string) {
    const { programId } = await LiveForge.build({
      prompt: description,
      network: 'devnet'
    });
    
    // Now use the newly built program
    await this.useProgram(programId);
  }
}
```

### Batch Building

```typescript
const prompts = [
  'Build NFT marketplace',
  'Build token launchpad',
  'Build lending protocol',
];

const results = await Promise.all(
  prompts.map(prompt => 
    LiveForge.build({ prompt, network: 'devnet' })
  )
);

console.log(`Built ${results.length} programs in parallel`);
```

### Error Handling

```typescript
try {
  const result = await LiveForge.build({
    prompt: 'Build a complex DeFi protocol',
    network: 'devnet',
    timeout: 600000, // 10 minutes
  });
} catch (error) {
  if (error.code === 'TIMEOUT') {
    console.log('Build took too long, retrying with simpler prompt');
  } else if (error.code === 'COMPILATION_FAILED') {
    console.log('Generated code failed to compile');
  }
}
```

## Advanced Features

### Streaming Progress

```typescript
const stream = LiveForge.buildStream({
  prompt: 'Build NFT minting program',
  network: 'devnet'
});

for await (const event of stream) {
  switch (event.type) {
    case 'reasoning':
      console.log(`AI: ${event.content}`);
      break;
    case 'code':
      console.log(`Code: ${event.content}`);
      break;
    case 'terminal':
      console.log(`$ ${event.content}`);
      break;
    case 'onchain':
      console.log(`On-chain: ${event.hash}`);
      break;
  }
}
```

### Custom Networks

```typescript
const mainnetBuild = await LiveForge.build({
  prompt: 'Build production-ready DEX',
  network: 'mainnet',
  deployKey: process.env.MAINNET_DEPLOY_KEY
});
```

## TypeScript SDK Coming Soon

```bash
npm install @liveforge/sdk
```

```typescript
import { LiveForge } from '@liveforge/sdk';

const forge = new LiveForge({
  apiKey: process.env.LIVEFORGE_API_KEY,
  network: 'devnet'
});

const result = await forge.build('Build an NFT marketplace');
```

## Contributing

Have a cool example? Submit a PR!

1. Add your example as `4-your-example.ts`
2. Add description to this README
3. Include comments explaining key concepts
