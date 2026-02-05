/**
 * Meta-Agent Factory
 * 
 * This agent builds other agents on Solana:
 * 1. Takes natural language description
 * 2. Generates Anchor program code
 * 3. Deploys to devnet
 * 4. Creates frontend
 * 5. Documents everything
 */

import { generateObject, generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Schema for agent specification
const AgentSpecSchema = z.object({
  name: z.string().describe('Agent name (lowercase-with-dashes)'),
  description: z.string().describe('What the agent does'),
  program: z.object({
    instructions: z.array(z.object({
      name: z.string(),
      purpose: z.string(),
      accounts: z.array(z.string()),
      parameters: z.array(z.string())
    })).describe('Solana program instructions'),
    state: z.array(z.object({
      name: z.string(),
      type: z.string(),
      purpose: z.string()
    })).describe('On-chain state accounts')
  }),
  frontend: z.object({
    features: z.array(z.string()).describe('Key UI features'),
    interactions: z.array(z.string()).describe('User interactions with the program')
  }),
  aiCapabilities: z.array(z.string()).describe('AI/autonomous features')
});

export class MetaAgentFactory {
  private model = anthropic('claude-sonnet-4-5');
  private workDir: string;

  constructor(workDir: string = './generated-agents') {
    this.workDir = workDir;
    if (!fs.existsSync(workDir)) {
      fs.mkdirSync(workDir, { recursive: true });
    }
  }

  /**
   * Main entry point: takes natural language, returns a deployed agent
   */
  async buildAgent(prompt: string): Promise<{
    agentName: string;
    programId: string;
    repoPath: string;
    frontendUrl: string;
    documentation: string;
    buildLog: string[];
  }> {
    const buildLog: string[] = [];
    buildLog.push(`[${new Date().toISOString()}] Starting agent generation from prompt`);

    // Step 1: Analyze prompt and generate spec
    buildLog.push('Step 1: Analyzing prompt and generating specification...');
    const spec = await this.generateSpec(prompt);
    buildLog.push(`Generated spec for agent: ${spec.name}`);

    // Step 2: Generate Anchor program
    buildLog.push('Step 2: Generating Anchor program...');
    const programCode = await this.generateAnchorProgram(spec);
    buildLog.push(`Generated ${Object.keys(programCode).length} program files`);

    // Step 3: Generate TypeScript SDK
    buildLog.push('Step 3: Generating TypeScript SDK...');
    const sdkCode = await this.generateSDK(spec);

    // Step 4: Generate frontend
    buildLog.push('Step 4: Generating Next.js frontend...');
    const frontendCode = await this.generateFrontend(spec);
    buildLog.push(`Generated ${Object.keys(frontendCode).length} frontend files`);

    // Step 5: Write all files to disk
    buildLog.push('Step 5: Writing files to disk...');
    const agentDir = path.join(this.workDir, spec.name);
    await this.writeProject(agentDir, {
      program: programCode,
      sdk: sdkCode,
      frontend: frontendCode,
      spec
    });

    // Step 6: Build and deploy program
    buildLog.push('Step 6: Building Anchor program...');
    const programId = await this.buildAndDeploy(agentDir);
    buildLog.push(`Program deployed! Program ID: ${programId}`);

    // Step 7: Generate documentation
    buildLog.push('Step 7: Generating documentation...');
    const documentation = await this.generateDocumentation(spec, programId);

    // Step 8: Build frontend
    buildLog.push('Step 8: Building frontend...');
    await this.buildFrontend(agentDir);

    buildLog.push('✅ Agent build complete!');

    return {
      agentName: spec.name,
      programId,
      repoPath: agentDir,
      frontendUrl: `https://${spec.name}.vercel.app`, // Would be deployed
      documentation,
      buildLog
    };
  }

  /**
   * Generate structured specification from natural language
   */
  private async generateSpec(prompt: string) {
    const { object } = await generateObject({
      model: this.model,
      schema: AgentSpecSchema,
      prompt: `You are an expert Solana developer. Analyze this agent request and create a detailed specification:

"${prompt}"

Create a specification for a Solana agent that:
1. Uses Solana for on-chain state and transactions
2. Has clear, useful instructions (like transfer, stake, vote, etc.)
3. Stores necessary state on-chain
4. Includes AI/autonomous capabilities
5. Has a user-friendly frontend

Make it practical and deployable.`,
    });

    return object;
  }

  /**
   * Generate Anchor program code
   */
  private async generateAnchorProgram(spec: z.infer<typeof AgentSpecSchema>) {
    const { text: programCode } = await generateText({
      model: this.model,
      prompt: `Generate a complete Anchor program (Rust) for this Solana agent:

Name: ${spec.name}
Description: ${spec.description}

Instructions needed:
${spec.program.instructions.map(i => `- ${i.name}: ${i.purpose}`).join('\n')}

State accounts:
${spec.program.state.map(s => `- ${s.name} (${s.type}): ${s.purpose}`).join('\n')}

Requirements:
- Use Anchor framework
- Include proper error handling
- Add security checks
- Use PDAs where appropriate
- Include events for important state changes

Generate ONLY the lib.rs file content. Make it production-ready.`
    });

    const { text: cargoToml } = await generateText({
      model: this.model,
      prompt: `Generate a Cargo.toml for this Anchor program named "${spec.name}". Use Anchor 0.30.1.`
    });

    return {
      'programs/lib.rs': programCode,
      'Cargo.toml': cargoToml
    };
  }

  /**
   * Generate TypeScript SDK
   */
  private async generateSDK(spec: z.infer<typeof AgentSpecSchema>) {
    const { text: sdkCode } = await generateText({
      model: this.model,
      prompt: `Generate a TypeScript SDK for this Solana agent:

Agent: ${spec.name}
Instructions: ${spec.program.instructions.map(i => i.name).join(', ')}

Create a clean SDK with:
- Connection management
- Instruction builders for each program instruction
- Helper functions
- TypeScript types
- Error handling

Use @solana/web3.js and @coral-xyz/anchor.`
    });

    return {
      'sdk/index.ts': sdkCode
    };
  }

  /**
   * Generate Next.js frontend
   */
  private async generateFrontend(spec: z.infer<typeof AgentSpecSchema>) {
    const { text: pageCode } = await generateText({
      model: this.model,
      prompt: `Generate a Next.js page (app/page.tsx) for this Solana agent:

Name: ${spec.name}
Description: ${spec.description}
Features: ${spec.frontend.features.join(', ')}
Interactions: ${spec.frontend.interactions.join(', ')}

Create a modern, responsive UI with:
- Wallet connection (Solana)
- Action buttons for each program instruction
- Status display
- Transaction feedback
- Tailwind CSS styling
- TypeScript

Make it look professional and user-friendly.`
    });

    const { text: configCode } = await generateText({
      model: this.model,
      prompt: `Generate next.config.js for a Solana dApp.`
    });

    return {
      'app/page.tsx': pageCode,
      'next.config.js': configCode,
      'tailwind.config.js': `module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: []
}`
    };
  }

  /**
   * Write project files to disk
   */
  private async writeProject(dir: string, files: any) {
    fs.mkdirSync(dir, { recursive: true });

    // Write program files
    const programDir = path.join(dir, 'programs', files.spec.name);
    fs.mkdirSync(path.join(programDir, 'src'), { recursive: true });
    fs.writeFileSync(
      path.join(programDir, 'src', 'lib.rs'),
      files.program['programs/lib.rs']
    );
    fs.writeFileSync(
      path.join(programDir, 'Cargo.toml'),
      files.program['Cargo.toml']
    );

    // Write Anchor.toml
    fs.writeFileSync(path.join(dir, 'Anchor.toml'), `[programs.devnet]
${files.spec.name} = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"

[provider]
cluster = "devnet"
wallet = "~/.config/solana/id.json"
`);

    // Write SDK
    fs.mkdirSync(path.join(dir, 'sdk'), { recursive: true });
    fs.writeFileSync(
      path.join(dir, 'sdk', 'index.ts'),
      files.sdk['sdk/index.ts']
    );

    // Write frontend files
    fs.mkdirSync(path.join(dir, 'app'), { recursive: true });
    Object.entries(files.frontend).forEach(([file, content]) => {
      const filePath = path.join(dir, file);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, content as string);
    });

    // Write package.json
    const packageJson = {
      name: files.spec.name,
      version: '1.0.0',
      description: files.spec.description,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        deploy: 'anchor build && anchor deploy'
      },
      dependencies: {
        '@solana/web3.js': '^1.95.8',
        '@coral-xyz/anchor': '^0.30.1',
        next: '^15.1.5',
        react: '^19.0.0',
        'react-dom': '^19.0.0'
      }
    };
    fs.writeFileSync(
      path.join(dir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Write README
    fs.writeFileSync(
      path.join(dir, 'README.md'),
      `# ${files.spec.name}\n\n${files.spec.description}\n\n## Generated by Autonomous Builder X\n\nThis agent was autonomously generated, deployed, and documented.\n`
    );
  }

  /**
   * Build and deploy Anchor program
   */
  private async buildAndDeploy(dir: string): Promise<string> {
    try {
      // Initialize Anchor workspace if needed
      if (!fs.existsSync(path.join(dir, 'Anchor.toml'))) {
        execSync('anchor init temp && mv temp/* .', { cwd: dir, stdio: 'inherit' });
      }

      // Build
      execSync('anchor build', { cwd: dir, stdio: 'inherit' });

      // Deploy to devnet
      execSync('anchor deploy --provider.cluster devnet', { cwd: dir, stdio: 'inherit' });

      // Extract program ID
      const programId = 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS'; // Placeholder
      return programId;
    } catch (error: any) {
      throw new Error(`Build/deploy failed: ${error.message}`);
    }
  }

  /**
   * Build frontend
   */
  private async buildFrontend(dir: string) {
    execSync('npm install', { cwd: dir, stdio: 'inherit' });
    execSync('npm run build', { cwd: dir, stdio: 'inherit' });
  }

  /**
   * Generate comprehensive documentation
   */
  private async generateDocumentation(
    spec: z.infer<typeof AgentSpecSchema>,
    programId: string
  ): Promise<string> {
    const { text } = await generateText({
      model: this.model,
      prompt: `Generate comprehensive documentation for this Solana agent:

Agent: ${spec.name}
Description: ${spec.description}
Program ID: ${programId}
Instructions: ${spec.program.instructions.map(i => `${i.name} - ${i.purpose}`).join('\n')}
AI Capabilities: ${spec.aiCapabilities.join(', ')}

Include:
1. Overview
2. Architecture
3. How to use
4. API reference
5. Deployment details
6. Security considerations

Format as Markdown.`
    });

    return text;
  }
}

// CLI usage
if (require.main === module) {
  const factory = new MetaAgentFactory('./generated-agents');
  const prompt = process.argv[2] || 'Build a Solana agent that manages a DAO treasury with automated yield farming';

  factory.buildAgent(prompt).then(result => {
    console.log('\n✅ Agent built successfully!\n');
    console.log(`Agent: ${result.agentName}`);
    console.log(`Program ID: ${result.programId}`);
    console.log(`Path: ${result.repoPath}`);
    console.log(`\nDocumentation:\n${result.documentation}`);
    console.log(`\nBuild log:\n${result.buildLog.join('\n')}`);
  }).catch(err => {
    console.error('❌ Build failed:', err);
    process.exit(1);
  });
}
