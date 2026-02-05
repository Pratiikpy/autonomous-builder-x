/**
 * Example 2: Verify On-Chain
 * 
 * Build an agent and verify all steps were logged on-chain with SHA256 hashes.
 */

import { Connection, PublicKey } from '@solana/web3.js';

const LIVEFORGE_API = 'https://autonomous-builder-x.vercel.app';
const DEVNET_RPC = 'https://api.devnet.solana.com';

async function buildAndVerify() {
  console.log('🚀 Building Solana agent with verification...\n');

  // Step 1: Build the agent
  const buildResponse = await fetch(`${LIVEFORGE_API}/api/live-build`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'Build a DAO voting system with quadratic voting',
      network: 'devnet',
    }),
  });

  const reader = buildResponse.body!.getReader();
  const decoder = new TextDecoder();
  
  let buildId = '';

  // Wait for build to complete
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));
        
        if (data.type === 'complete') {
          buildId = data.buildId;
          console.log(`✅ Build complete: ${buildId}\n`);
        }
      }
    }
  }

  // Step 2: Verify on-chain
  console.log('🔍 Verifying on-chain...\n');

  const verifyResponse = await fetch(
    `${LIVEFORGE_API}/api/verify-build?buildId=${buildId}`
  );
  const verification = await verifyResponse.json();

  if (verification.verified) {
    console.log('✅ On-chain verification successful!\n');
    console.log('Build steps logged on Solana:');
    
    verification.onchainSteps.forEach((step: any, index: number) => {
      console.log(`  ${index + 1}. ${step.actionType}`);
      console.log(`     Hash: ${step.hash}`);
      console.log(`     TX: ${step.txHash}\n`);
    });

    // Step 3: Query Solana directly to verify
    const connection = new Connection(DEVNET_RPC);
    const buildAccount = new PublicKey(verification.buildAccountAddress);
    
    const accountInfo = await connection.getAccountInfo(buildAccount);
    if (accountInfo) {
      console.log('✅ Verified: Build account exists on Solana');
      console.log(`   Size: ${accountInfo.data.length} bytes`);
      console.log(`   Owner: ${accountInfo.owner.toBase58()}`);
    } else {
      console.log('❌ Build account not found on-chain');
    }
  } else {
    console.log('❌ On-chain verification failed');
  }
}

// Run example
buildAndVerify()
  .then(() => console.log('\n🎉 Verification complete!'))
  .catch((error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
