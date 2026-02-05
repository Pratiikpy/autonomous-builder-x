/**
 * Shared build store for serverless environment
 * Uses global object to persist across function invocations within the same container
 */

export interface BuildRecord {
  id: string;
  prompt: string;
  status: 'success' | 'failed' | 'in_progress';
  startedAt: string;
  completedAt: string | null;
  duration: string | null;
  programId: string | null;
  chainProofs: Array<{ step: number; txHash: string; hash: string }>;
  files: Array<{ name: string; content: string }>;
}

// Use global to persist build store across function invocations
declare global {
  var buildStore: Map<string, BuildRecord> | undefined;
}

// Initialize build store with seed data on cold start
function initializeBuildStore(): Map<string, BuildRecord> {
  const store = new Map<string, BuildRecord>();
  
  // Seed with example builds
  store.set('build_1234567890', {
    id: 'build_1234567890',
    prompt: 'Build a Solana NFT minting program with metadata support',
    status: 'success',
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 4 * 60 * 1000).toISOString(),
    duration: '4m 12s',
    files: [
      { 
        name: 'lib.rs', 
        content: 'use anchor_lang::prelude::*;\n\n// NFT Minting Program\ndeclare_id!("DemoNFT1111111111111111111111111111111111111");\n\n#[program]\npub mod nft_minter {\n    use super::*;\n    \n    pub fn mint_nft(ctx: Context<MintNFT>, metadata_uri: String) -> Result<()> {\n        // Minting logic here\n        Ok(())\n    }\n}' 
      }
    ],
    chainProofs: [
      { step: 1, txHash: '2Z8xkYfj3mNpQrS4tUvWxY1zA2bC3dE4fG5hH6iJ7kL8m', hash: 'abc123...' },
      { step: 2, txHash: '5Yfj3mNpQrS4tUvWxY1zA2bC3dE4fG5hH6iJ7kL8m9n', hash: 'def456...' }
    ],
    programId: 'DemoNFT1111111111111111111111111111111111111'
  });
  
  store.set('build_0987654321', {
    id: 'build_0987654321',
    prompt: 'Build a DAO treasury manager with voting mechanism',
    status: 'success',
    startedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
    duration: '5m 18s',
    files: [
      { 
        name: 'lib.rs', 
        content: 'use anchor_lang::prelude::*;\n\n// DAO Treasury Manager\ndeclare_id!("DemoDAO1111111111111111111111111111111111111");\n\n#[program]\npub mod dao_treasury {\n    use super::*;\n    \n    pub fn create_proposal(ctx: Context<CreateProposal>, proposal: String) -> Result<()> {\n        // Proposal logic\n        Ok(())\n    }\n}' 
      }
    ],
    chainProofs: [
      { step: 1, txHash: '7Hj9mNpQrS4tUvWxY1zA2bC3dE4fG5hH6iJ7kL8m9n0', hash: 'ghi789...' },
      { step: 2, txHash: '3KlMnO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3', hash: 'jkl012...' }
    ],
    programId: 'DemoDAO1111111111111111111111111111111111111'
  });
  
  store.set('build_5555555555', {
    id: 'build_5555555555',
    prompt: 'Build a staking rewards distributor',
    status: 'success',
    startedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 8 * 60 * 60 * 1000 + 3 * 60 * 1000).toISOString(),
    duration: '3m 45s',
    files: [
      { 
        name: 'lib.rs', 
        content: 'use anchor_lang::prelude::*;\n\n// Staking Rewards\ndeclare_id!("DemoStake111111111111111111111111111111111111");\n\n#[program]\npub mod staking_rewards {\n    use super::*;\n    \n    pub fn stake_tokens(ctx: Context<Stake>, amount: u64) -> Result<()> {\n        // Staking logic\n        Ok(())\n    }\n}' 
      }
    ],
    chainProofs: [
      { step: 1, txHash: '9KpQrS4tUvWxY1zA2bC3dE4fG5hH6iJ7kL8m9n0oP1q', hash: 'jkl012...' },
      { step: 2, txHash: '3RsT4uVwXyZ1aB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1l', hash: 'mno345...' }
    ],
    programId: 'DemoStake111111111111111111111111111111111111'
  });
  
  return store;
}

// Get or initialize the build store
export function getBuildStore(): Map<string, BuildRecord> {
  if (!global.buildStore) {
    global.buildStore = initializeBuildStore();
  }
  return global.buildStore;
}

// Helper functions
export function addBuild(build: BuildRecord): void {
  const store = getBuildStore();
  store.set(build.id, build);
}

export function updateBuild(id: string, updates: Partial<BuildRecord>): void {
  const store = getBuildStore();
  const existing = store.get(id);
  if (existing) {
    store.set(id, { ...existing, ...updates });
  }
}

export function getBuild(id: string): BuildRecord | undefined {
  const store = getBuildStore();
  return store.get(id);
}

export function getAllBuilds(): BuildRecord[] {
  const store = getBuildStore();
  return Array.from(store.values()).sort((a, b) => {
    return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
  });
}
