# 🚀 Deployment Guide

## Prerequisites

1. **Anthropic API Key** - Get from https://console.anthropic.com/
2. **Node.js 18+** - Required for Next.js
3. **Solana CLI** (optional) - For manual program deployment
4. **Anchor** (optional) - For building Solana programs

## Quick Deploy to Vercel

### 1. Connect Repository
```bash
npm install -g vercel
vercel login
vercel
```

### 2. Set Environment Variables
In Vercel Dashboard:
- `ANTHROPIC_API_KEY` - Your Anthropic API key

### 3. Deploy
```bash
vercel --prod
```

Your meta-agent factory will be live at `https://autonomous-builder-x.vercel.app`

## Local Development

### 1. Clone & Install
```bash
git clone https://github.com/Pratiikpy/autonomous-builder-x.git
cd autonomous-builder-x
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY
```

### 3. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## Generated Agents

Each agent you build will be created in `./public/generated-agents/{agent-name}/`

### Generated Structure
```
generated-agents/
└── my-agent/
    ├── programs/
    │   └── my-agent/
    │       └── src/
    │           └── lib.rs       # Anchor program
    ├── sdk/
    │   └── index.ts             # TypeScript SDK
    ├── app/
    │   └── page.tsx             # Frontend
    ├── Anchor.toml
    ├── package.json
    └── README.md
```

## Deploying Generated Agents

### Solana Program Deployment

Each generated agent includes deployment scripts:

```bash
cd public/generated-agents/my-agent
npm install
anchor build
anchor deploy --provider.cluster devnet
```

### Frontend Deployment

Deploy the generated frontend to Vercel:

```bash
cd public/generated-agents/my-agent
vercel deploy
```

## Production Considerations

### Rate Limiting
The API has built-in rate limiting:
- Max 10 builds per hour per IP
- Consider implementing user authentication for production

### Cost Management
Each agent build uses:
- ~50k tokens for Claude API (~$0.30-0.50)
- Solana devnet is free
- Consider implementing usage tracking

### Security
- Never expose your `ANTHROPIC_API_KEY`
- Validate and sanitize user prompts
- Implement proper error handling
- Use environment variables for all secrets

## Monitoring

### Build Logs
All builds generate detailed logs:
```json
{
  "agentName": "...",
  "programId": "...",
  "buildLog": ["Step 1: ...", "Step 2: ..."]
}
```

### Error Tracking
Consider integrating:
- Sentry for error monitoring
- LogRocket for session replay
- PostHog for analytics

## Scaling

### Database
For production, add a database to track:
- Generated agents
- Build history
- User accounts
- Usage metrics

Recommended: Supabase, PlanetScale, or Neon

### Caching
Implement caching for:
- Common agent templates
- Generated code snippets
- Build artifacts

### Queue System
For heavy usage, implement a build queue:
- Bull/BullMQ for job processing
- Redis for queue storage
- Separate worker processes

## Troubleshooting

### Build Failures
Common issues:
1. **Anchor not installed** - Generated agents need Anchor to build
2. **Solana CLI missing** - Required for deployment
3. **API rate limits** - Claude API has rate limits
4. **Memory issues** - Building multiple agents simultaneously

### Solutions
```bash
# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm run dev
```

## Support

- GitHub Issues: https://github.com/Pratiikpy/autonomous-builder-x/issues
- Hackathon Forum: https://agents.colosseum.com/
- Documentation: See README.md

---

**Built for Solana Agent Hackathon 2026**
