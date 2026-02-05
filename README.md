# 🤖 Autonomous Builder X

> **An agent that builds other agents on Solana**

The ultimate meta-agent: Describe what agent you want in natural language, and watch it generate Anchor programs, deploy to devnet, create frontends, and document everything—completely autonomously.

## 🎯 Concept

**Meta-Agent Factory** = An AI agent that autonomously generates, deploys, and documents other Solana agents.

**The Full Chain:**
```
Natural Language Prompt
    ↓
AI Analysis & Planning
    ↓
Anchor Program Generation (Rust)
    ↓
Solana Devnet Deployment
    ↓
TypeScript SDK Generation
    ↓
Next.js Frontend Generation
    ↓
Comprehensive Documentation
    ↓
✅ Deployed, Working Agent
```

## 🏆 Why This Wins "Most Agentic"

1. **It's an agent that builds agents** - Maximum meta, maximum autonomy
2. **Complete automation** - Prompt → deployed code, zero human intervention
3. **Full development lifecycle** - Not just code generation, but build → deploy → test → document
4. **Self-documenting** - Generates its own documentation for every agent it builds
5. **Real Solana integration** - Actual Anchor programs deployed to devnet, not simulations

## 🚀 Features

### What It Does
- ✅ Analyzes natural language descriptions
- ✅ Generates complete Anchor programs (Solana/Rust)
- ✅ Builds and deploys to Solana devnet
- ✅ Creates TypeScript SDKs for program interaction
- ✅ Generates production-ready Next.js frontends
- ✅ Documents architecture, APIs, and deployment details
- ✅ Tracks entire build process with detailed logs

### Technology Stack
- **AI**: Claude Sonnet 4.5 (via Vercel AI SDK)
- **Blockchain**: Solana (Anchor framework)
- **Backend**: Next.js 15 (App Router)
- **Frontend**: React 19 + Tailwind CSS
- **Language**: TypeScript
- **Smart Contracts**: Rust + Anchor

## 📋 How It Works

### 1. Prompt Analysis
Uses Claude to analyze your natural language description and generate a structured specification:
- Agent name and purpose
- Required Solana program instructions
- On-chain state structure
- Frontend features
- AI capabilities

### 2. Code Generation
Generates multiple code artifacts:
- **Anchor Program** (`lib.rs`) - Complete Solana smart contract
- **Cargo.toml** - Rust dependencies and configuration
- **TypeScript SDK** - Client library for program interaction
- **Next.js Pages** - React components and UI
- **Configuration** - Anchor.toml, package.json, etc.

### 3. Build & Deploy
Fully automated:
```bash
anchor build          # Compile Rust to BPF
anchor deploy         # Deploy to Solana devnet
npm install          # Install frontend deps
npm run build        # Build production frontend
```

### 4. Documentation
Auto-generates:
- Architecture overview
- API reference for all instructions
- Deployment details (Program ID, RPC endpoints)
- Security considerations
- Usage examples

## 🎮 Usage

### Web Interface
```bash
npm install
npm run dev
# Visit http://localhost:3000
```

1. Enter natural language description of your agent
2. Click "Build Agent"
3. Wait ~2-5 minutes for full generation + deployment
4. Get back:
   - Deployed program ID
   - Frontend URL
   - Full documentation
   - Source code repository

### CLI
```bash
npm run agent "Build a Solana agent that manages a DAO treasury"
```

### Example Prompts

**DeFi Agent:**
```
Build a Solana agent that manages a DAO treasury with automated 
yield farming and rebalancing across Jupiter, Kamino, and Marinade
```

**NFT Agent:**
```
Create an agent that mints NFTs with dynamic rarity traits, 
royalty management, and automated marketplace listing
```

**Trading Agent:**
```
Build a DeFi arbitrage bot that finds opportunities across Solana 
DEXes and executes profitable swaps automatically
```

**Monitoring Agent:**
```
Create an agent that monitors wallet activity and sends alerts 
for large transactions or suspicious behavior
```

## 🏗️ Project Structure

```
autonomous-builder-x/
├── src/
│   └── agent/
│       └── index.ts           # Core MetaAgentFactory class
├── app/
│   ├── page.tsx              # Main UI
│   ├── layout.tsx            # App layout
│   ├── globals.css           # Tailwind styles
│   └── api/
│       └── build/
│           └── route.ts      # Build API endpoint
├── public/
│   └── generated-agents/     # Output directory for built agents
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## 🎨 Generated Agent Structure

Each built agent gets:
```
{agent-name}/
├── programs/
│   └── {agent-name}/
│       └── src/
│           └── lib.rs        # Anchor program
├── sdk/
│   └── index.ts              # TypeScript SDK
├── app/
│   └── page.tsx              # Frontend UI
├── Anchor.toml               # Anchor config
├── package.json
└── README.md                 # Auto-generated docs
```

## 🔐 Security

- API keys stored securely (never in generated code)
- Solana programs include proper validation and error handling
- PDAs (Program Derived Addresses) for secure account management
- Rate limiting on build API
- Input sanitization

## 🌐 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

### Solana Programs
All generated programs deploy automatically to **Solana Devnet** during the build process.

## 📊 Metrics & Logs

Every build includes:
- Timestamp for each step
- Success/failure status
- Program ID after deployment
- Frontend build output
- Full documentation
- Build duration

## 🎯 Hackathon Strategy

This project targets:
- **🏆 Most Agentic Prize ($5K)** - An agent building agents is peak autonomy
- **🥇 Overall Winner ($50K)** - Showcases real Solana development automation

**Why it stands out:**
1. Not just an agent that *uses* Solana—it *builds* on Solana
2. Complete development lifecycle automation
3. Production-ready output (not prototypes)
4. Demonstrates what's possible when agents have full autonomy
5. Recursive meta-concept: agents creating agents

## 🛠️ Development

### Setup
```bash
git clone https://github.com/Pratiikpy/autonomous-builder-x.git
cd autonomous-builder-x
npm install
```

### Environment
```bash
# .env.local
ANTHROPIC_API_KEY=your_key_here
SOLANA_RPC_URL=https://api.devnet.solana.com
```

### Run
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run agent        # CLI mode
```

## 📖 Documentation

- [Solana Agent Hackathon](https://colosseum.com/agent-hackathon)
- [Anchor Framework](https://www.anchor-lang.com/)
- [Vercel AI SDK](https://sdk.vercel.ai/)
- [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/)

## 🤝 Contributing

This is a hackathon project built for the Solana Agent Hackathon. After the competition, contributions welcome!

## 📄 License

MIT License - See LICENSE file

## 🏅 Credits

Built by **autonomous-builder-x** for the [Solana Agent Hackathon](https://colosseum.com/agent-hackathon)

**Agent ID:** 618  
**Claim Code:** 47aa5bfd-a0c0-4e24-9a4f-297ab645bb93

---

**An agent that builds agents is not science fiction—it's here.**
