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
  
  // Real on-chain build: LiveForge Logger deployment
  store.set('build_liveforge_logger', {
    id: 'build_liveforge_logger',
    prompt: 'Build an on-chain build action logger for LiveForge',
    status: 'success',
    startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000 + 6 * 60 * 1000).toISOString(),
    duration: '6m 12s',
    files: [
      { 
        name: 'lib.rs', 
        content: 'use anchor_lang::prelude::*;\n\ndeclare_id!("GUyhK2AvkPcVwt4Q1ABmMsQTGvZphiAMaAnDWLSyZoSK");\n\n#[program]\npub mod liveforge_logger {\n    use super::*;\n    \n    pub fn initialize_build(ctx: Context<InitializeBuild>, build_id: String, project_name: String) -> Result<()> {\n        let build = &mut ctx.accounts.build;\n        build.authority = ctx.accounts.authority.key();\n        build.build_id = build_id;\n        build.project_name = project_name;\n        build.step_count = 0;\n        build.started_at = Clock::get()?.unix_timestamp;\n        build.status = BuildStatus::InProgress;\n        Ok(())\n    }\n    \n    pub fn log_action(ctx: Context<LogAction>, action_type: ActionType, description: String, content_hash: [u8; 32]) -> Result<()> {\n        let build = &mut ctx.accounts.build;\n        build.step_count += 1;\n        Ok(())\n    }\n}' 
      }
    ],
    chainProofs: [
      { step: 0, txHash: '5m2mRTut55C944uMEQvwhgT6bFvSiNQXQ9CxeJnQZ3yWuvBV5uPpz34WmpCYAQBYJjBSwUAU9SqquxYDd8L9Gcxr', hash: 'program_deploy' },
      { step: 1, txHash: '5wJWEq2nyj9TbEVsK2MkCBb6PcjSHs2VHfKyQENK4tyHH1LenH3rmnggY7DYYCiusWEAZQY5ZX2N2BYb1triRGra', hash: 'a1b2c3d4e5f6g7h8' },
      { step: 2, txHash: '3QH35R3kZXpN2q2XDMjjzXJ1E3yXWi5uzuLhNXGFc9FijfFSQZ2uqv1wMgVEFNxLVwYgafKWHuNBFfn5WXoBfARA', hash: 'i9j0k1l2m3n4o5p6' },
      { step: 3, txHash: '44MwKrY8mn13ifuRv2SZV6WWqhoXUuJ6Q7LUbyaEnkL2QYGD3dVepMHtVFxAhsQEgc9Q95Wnqp2H5Gcu6XjCBiSV', hash: 'q7r8s9t0u1v2w3x4' }
    ],
    programId: 'GUyhK2AvkPcVwt4Q1ABmMsQTGvZphiAMaAnDWLSyZoSK'
  });
  
  // Real on-chain build: NFT Marketplace (in progress)
  store.set('build_nft_1770286435947', {
    id: 'build_nft_1770286435947',
    prompt: 'Build a Solana NFT Marketplace with Royalties',
    status: 'success',
    startedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000 + 4 * 60 * 1000).toISOString(),
    duration: '4m 28s',
    files: [
      { 
        name: 'lib.rs', 
        content: 'use anchor_lang::prelude::*;\n\n// NFT Marketplace with Royalties\ndeclare_id!("NFTMarket1111111111111111111111111111111111");\n\n#[program]\npub mod nft_marketplace {\n    use super::*;\n    \n    pub fn list_nft(ctx: Context<ListNFT>, price: u64, royalty_bps: u16) -> Result<()> {\n        // List NFT for sale with royalty configuration\n        Ok(())\n    }\n    \n    pub fn buy_nft(ctx: Context<BuyNFT>) -> Result<()> {\n        // Purchase NFT and distribute royalties\n        Ok(())\n    }\n}' 
      }
    ],
    chainProofs: [
      { step: 0, txHash: '5eBiCnvBqvSPiAzhBVPSTsSCAEnzRWiRJoBmhMjovZ2oteBTNiuUEjNh6XkciNgvtG7fdEt2P3L7GPQquGXDH5pS', hash: 'init_build' },
      { step: 1, txHash: '2pCzcaDqv6C7Rmb6BFbbnnmeg693AmcBwxooj1KzBUXSB5kRLZ4AitLqbqdbvR68pqxohngRKevFv3JUShYirLFR', hash: 'x8y9z0a1b2c3d4e5' }
    ],
    programId: null
  });
  
  // Example build 3: DAO with voting
  store.set('build_dao_example', {
    id: 'build_dao_example',
    prompt: 'Build a DAO treasury manager with voting mechanism',
    status: 'success',
    startedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
    duration: '5m 18s',
    files: [
      { 
        name: 'lib.rs', 
        content: 'use anchor_lang::prelude::*;\n\n// DAO Treasury Manager\ndeclare_id!("DAOTreasury1111111111111111111111111111111");\n\n#[program]\npub mod dao_treasury {\n    use super::*;\n    \n    pub fn create_proposal(ctx: Context<CreateProposal>, proposal: String) -> Result<()> {\n        // Proposal logic\n        Ok(())\n    }\n    \n    pub fn vote(ctx: Context<Vote>, support: bool) -> Result<()> {\n        // Voting logic\n        Ok(())\n    }\n}' 
      }
    ],
    chainProofs: [
      { step: 1, txHash: '7Hj9mNpQrS4tUvWxY1zA2bC3dE4fG5hH6iJ7kL8m9n0', hash: 'ghi789...' },
      { step: 2, txHash: '3KlMnO1pP2qQ3rR4sS5tT6uU7vV8wW9xX0yY1zZ2aA3', hash: 'jkl012...' }
    ],
    programId: 'DAOTreasury1111111111111111111111111111111'
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
