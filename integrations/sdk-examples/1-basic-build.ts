/**
 * Example 1: Basic Build
 * 
 * Build a simple Solana agent and get the deployed program ID.
 */

const LIVEFORGE_API = 'https://autonomous-builder-x.vercel.app';

async function buildBasicAgent() {
  console.log('🚀 Starting basic build...\n');

  const response = await fetch(`${LIVEFORGE_API}/api/live-build`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'Build a simple Solana NFT minting program',
      network: 'devnet',
    }),
  });

  if (!response.ok) {
    throw new Error(`Build failed: ${response.statusText}`);
  }

  // Parse streaming response
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  
  let programId = '';
  let buildId = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));
        
        if (data.type === 'reasoning') {
          console.log(`🤖 AI: ${data.content}`);
        } else if (data.type === 'terminal') {
          console.log(`💻 ${data.content}`);
        } else if (data.type === 'complete') {
          programId = data.programId;
          buildId = data.buildId;
          console.log(`\n✅ Build complete!`);
          console.log(`📍 Program ID: ${programId}`);
          console.log(`🆔 Build ID: ${buildId}`);
        }
      }
    }
  }

  return { programId, buildId };
}

// Run example
buildBasicAgent()
  .then(({ programId, buildId }) => {
    console.log('\n🎉 Success! Your Solana agent is deployed.');
    console.log(`View on Solana Explorer: https://explorer.solana.com/address/${programId}?cluster=devnet`);
  })
  .catch((error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
