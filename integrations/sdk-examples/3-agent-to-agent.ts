/**
 * Example 3: Agent-to-Agent Building
 * 
 * Demonstrates how one agent can use LiveForge to build other agents.
 * This creates a meta-agent that builds specialized sub-agents on demand.
 */

interface AgentTask {
  name: string;
  prompt: string;
  purpose: string;
}

const LIVEFORGE_API = 'https://autonomous-builder-x.vercel.app';

class MetaAgent {
  private builtAgents: Map<string, string> = new Map();

  async buildSubAgent(task: AgentTask): Promise<string> {
    console.log(`\n🤖 Meta-Agent: Building sub-agent for "${task.purpose}"\n`);

    const response = await fetch(`${LIVEFORGE_API}/api/live-build`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: task.prompt,
        network: 'devnet',
      }),
    });

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    
    let programId = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));
          
          if (data.type === 'reasoning') {
            console.log(`  💭 ${data.content}`);
          } else if (data.type === 'complete') {
            programId = data.programId;
            console.log(`  ✅ Sub-agent deployed: ${programId}`);
          }
        }
      }
    }

    this.builtAgents.set(task.name, programId);
    return programId;
  }

  async orchestrate(tasks: AgentTask[]): Promise<void> {
    console.log('🚀 Meta-Agent: Orchestrating multi-agent build...\n');
    console.log(`Tasks to build: ${tasks.length}\n`);

    for (const task of tasks) {
      await this.buildSubAgent(task);
      console.log(`✅ ${task.name} ready\n`);
    }

    console.log('\n🎉 All sub-agents built and deployed!\n');
    console.log('Agent Fleet:');
    this.builtAgents.forEach((programId, name) => {
      console.log(`  - ${name}: ${programId}`);
    });
  }

  getAgent(name: string): string | undefined {
    return this.builtAgents.get(name);
  }
}

// Example: Build a DeFi agent fleet
async function buildDeFiFleet() {
  const metaAgent = new MetaAgent();

  const tasks: AgentTask[] = [
    {
      name: 'Arbitrage Monitor',
      prompt: 'Build a Solana DEX arbitrage detector that monitors price differences',
      purpose: 'Detect arbitrage opportunities across Jupiter, Orca, and Raydium',
    },
    {
      name: 'Treasury Manager',
      prompt: 'Build a DAO treasury manager with automated yield farming to Solana lending protocols',
      purpose: 'Optimize DAO treasury returns',
    },
    {
      name: 'Token Vesting',
      prompt: 'Build a token vesting system with cliff periods and linear unlocking',
      purpose: 'Handle team and investor token vesting',
    },
  ];

  await metaAgent.orchestrate(tasks);

  // Now the meta-agent can coordinate these sub-agents
  console.log('\n🎯 Meta-Agent: Sub-agents deployed and ready for coordination');
  console.log('Example usage:');
  console.log('  1. Arbitrage Monitor finds opportunity');
  console.log('  2. Meta-Agent coordinates with Treasury Manager');
  console.log('  3. Treasury executes trade through its program ID');
}

// Run example
buildDeFiFleet()
  .then(() => console.log('\n🎉 DeFi agent fleet operational!'))
  .catch((error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
