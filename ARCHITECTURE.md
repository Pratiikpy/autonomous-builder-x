# 🏗️ Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│                    (Next.js + React + Tailwind)                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Layer                                │
│                    (Next.js API Routes)                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MetaAgentFactory                             │
│                  (Core Business Logic)                          │
└─────┬───────────┬───────────┬──────────┬────────────┬──────────┘
      │           │           │          │            │
      ▼           ▼           ▼          ▼            ▼
  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────────┐
  │Analyze │ │Generate│ │  Build │ │ Deploy │ │  Document  │
  │ Prompt │ │  Code  │ │Program │ │to Devnet│ │& Package  │
  └────────┘ └────────┘ └────────┘ └────────┘ └────────────┘
      │           │           │          │            │
      └───────────┴───────────┴──────────┴────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Generated Agent │
                    │  - Anchor Code   │
                    │  - TypeScript SDK│
                    │  - Frontend      │
                    │  - Documentation │
                    └─────────────────┘
```

## Core Components

### 1. MetaAgentFactory (`src/agent/index.ts`)

The brain of the system. Orchestrates the entire agent generation pipeline.

**Key Methods:**
- `buildAgent(prompt)` - Main entry point
- `generateSpec(prompt)` - LLM-powered specification generation
- `generateAnchorProgram(spec)` - Rust/Anchor code generation
- `generateSDK(spec)` - TypeScript SDK generation
- `generateFrontend(spec)` - Next.js UI generation
- `buildAndDeploy(dir)` - Compilation and deployment
- `generateDocumentation(spec)` - Auto-documentation

**Technologies:**
- Vercel AI SDK for LLM integration
- Claude Sonnet 4.5 for code generation
- Zod for schema validation
- Node.js fs/path for file operations
- child_process for shell command execution

### 2. Frontend (`app/page.tsx`)

Beautiful, responsive UI built with:
- React 19 (Server Components where appropriate)
- Tailwind CSS for styling
- Real-time build status updates
- Expandable documentation viewer
- Build log display

**User Flow:**
1. Enter natural language prompt
2. Click "Build Agent"
3. Wait for generation (~2-5 minutes)
4. View results:
   - Agent name
   - Program ID
   - Frontend URL
   - Documentation
   - Build logs

### 3. API Layer (`app/api/build/route.ts`)

Thin REST API wrapping the MetaAgentFactory:
- POST `/api/build` - Trigger agent generation
- Error handling and validation
- Response formatting

### 4. Generated Agent Structure

Each generated agent is a complete, deployable project:

```
generated-agents/
└── {agent-name}/
    ├── programs/
    │   └── {agent-name}/
    │       ├── src/
    │       │   └── lib.rs        # Anchor program (Rust)
    │       └── Cargo.toml        # Rust dependencies
    ├── sdk/
    │   └── index.ts              # TypeScript SDK
    ├── app/
    │   └── page.tsx              # Frontend UI
    ├── Anchor.toml               # Anchor configuration
    ├── package.json              # Node.js dependencies
    ├── next.config.js            # Next.js config
    ├── tailwind.config.js        # Tailwind config
    └── README.md                 # Auto-generated docs
```

## Generation Pipeline

### Phase 1: Analysis & Planning
```
Natural Language Prompt
        ↓
Claude Sonnet 4.5 (via AI SDK)
        ↓
Structured Specification (Zod-validated)
```

**Output:** JSON object containing:
- Agent name and description
- Required instructions (functions)
- State account structures
- Frontend features
- AI capabilities

### Phase 2: Code Generation

**Anchor Program (Rust):**
```
Specification
        ↓
Claude Sonnet 4.5 + Prompt Engineering
        ↓
Complete lib.rs file
- Instructions (program functions)
- State structs
- Error handling
- Events
- PDAs
```

**TypeScript SDK:**
```
Specification
        ↓
Claude Sonnet 4.5
        ↓
SDK with:
- Connection management
- Instruction builders
- Helper functions
- Type definitions
```

**Frontend (Next.js):**
```
Specification
        ↓
Claude Sonnet 4.5
        ↓
React components with:
- Wallet connection
- UI for each instruction
- Transaction handling
- Tailwind styling
```

### Phase 3: Build & Deploy

```
Generated Code
        ↓
Write to filesystem
        ↓
Execute: anchor build
        ↓
Execute: anchor deploy --provider.cluster devnet
        ↓
Extract Program ID
        ↓
Return deployment details
```

### Phase 4: Documentation

```
Specification + Program ID
        ↓
Claude Sonnet 4.5
        ↓
Markdown documentation:
- Architecture overview
- API reference
- Deployment guide
- Security notes
```

## AI Integration

### Model: Claude Sonnet 4.5 (Anthropic)

**Why Claude?**
- Superior code generation quality
- Long context window (200k tokens)
- Strong reasoning capabilities
- Excellent Rust/TypeScript output

**Usage Patterns:**

1. **Structured Generation** (with Zod schemas):
```typescript
const { object } = await generateObject({
  model: anthropic('claude-sonnet-4.5'),
  schema: AgentSpecSchema,
  prompt: "..."
});
```

2. **Text Generation** (for code):
```typescript
const { text } = await generateText({
  model: anthropic('claude-sonnet-4.5'),
  prompt: "..."
});
```

### Prompt Engineering

Each generation phase uses carefully crafted prompts:
- Clear role definition ("You are an expert Solana developer")
- Specific output requirements
- Example structures
- Security and best practice reminders

## Solana Integration

### Anchor Framework

All generated programs use Anchor:
- IDL (Interface Definition Language) auto-generation
- Serialization/deserialization
- Account validation
- Cross-program invocations (CPI)

### Deployment

Programs deploy to **Solana Devnet**:
- RPC: `https://api.devnet.solana.com`
- Fast, free transactions
- Perfect for testing and hackathons

### Account Structure

Generated programs typically include:
- **PDAs** (Program Derived Addresses) for secure state
- **Instruction handlers** for each function
- **State structs** for on-chain data
- **Events** for transaction tracking

## Scalability & Performance

### Current Limitations
- Synchronous build process (blocks API)
- No build queuing
- Single-threaded execution
- Memory-intensive for large projects

### Future Improvements

**1. Job Queue System**
```
User Request → Redis Queue → Worker Processes → Database
```

**2. Caching Layer**
```
Common Patterns → Cache → Instant Response
```

**3. Parallel Generation**
```
Code Gen   ┐
SDK Gen    ├─ Parallel → Combine → Deploy
Frontend   ┘
```

**4. Streaming Responses**
```
Build Step 1 → Stream to client
Build Step 2 → Stream to client
Build Step 3 → Stream to client
```

## Security Considerations

### Input Validation
- Sanitize all user prompts
- Rate limiting on API endpoints
- Maximum prompt length enforcement

### Generated Code Security
- Prompt includes security best practices
- Generated programs include:
  - Access control checks
  - Integer overflow protection
  - PDA validation
  - Proper error handling

### API Key Protection
- Never expose Anthropic API key
- Server-side only execution
- Environment variable storage

### Solana Security
- Generated programs use PDAs (no direct key storage)
- Account validation on every instruction
- Proper signer checks

## Monitoring & Observability

### Build Logs
Every build generates detailed logs:
```
[timestamp] Step 1: Analyzing prompt...
[timestamp] Step 2: Generating Anchor program...
[timestamp] Step 3: Building program...
[timestamp] Step 4: Deploying to devnet...
[timestamp] ✅ Deploy complete: {programId}
```

### Error Tracking
Structured error responses:
```json
{
  "error": "Build failed",
  "phase": "deployment",
  "details": "...",
  "timestamp": "..."
}
```

## Tech Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 15 + React 19 | UI framework |
| Styling | Tailwind CSS | Responsive design |
| API | Next.js API Routes | REST endpoints |
| AI | Claude Sonnet 4.5 | Code generation |
| AI SDK | Vercel AI SDK | LLM integration |
| Blockchain | Solana + Anchor | Smart contracts |
| Language | TypeScript + Rust | Type-safe code |
| Validation | Zod | Schema validation |
| Deployment | Vercel | Hosting |

## Design Decisions

### Why Next.js?
- Full-stack framework (API + Frontend)
- Server-side AI calls (secure API keys)
- Easy Vercel deployment
- TypeScript support

### Why Claude Sonnet 4.5?
- Best code generation quality
- Strong at Rust and TypeScript
- Long context for complex prompts
- Reliable structured output

### Why Anchor?
- Industry standard for Solana
- Type-safe Rust framework
- Auto-generates IDLs
- Great developer experience

### Why Devnet?
- Free transactions
- Fast block times
- No real money at risk
- Perfect for hackathons

## Future Enhancements

1. **Template Library** - Pre-built agent patterns
2. **Agent Marketplace** - Share generated agents
3. **Version Control** - Track agent iterations
4. **Testing Suite** - Auto-generate tests
5. **Multi-chain** - Support other blockchains
6. **AI Training** - Learn from successful builds
7. **Collaboration** - Multi-agent builds
8. **Analytics** - Track usage and performance

---

**This architecture enables the ultimate autonomous development system: from idea to deployed, documented Solana agent in minutes.**
