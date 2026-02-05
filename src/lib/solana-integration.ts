/**
 * Real Solana Integration - Replaces mock functions in live-builder.ts
 */

import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { LiveForgeClient, ActionType } from '../../sdk/src/index';
import * as fs from 'fs';
import * as path from 'path';

// Program ID (will be updated after deployment)
const PROGRAM_ID = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');

export class SolanaLogger {
  private client: LiveForgeClient;
  private connection: Connection;
  private authority: Keypair;

  constructor(cluster: 'devnet' | 'mainnet-beta' = 'devnet') {
    // Initialize connection
    this.connection = new Connection(
      cluster === 'devnet' 
        ? clusterApiUrl('devnet')
        : clusterApiUrl('mainnet-beta'),
      'confirmed'
    );

    // Load authority keypair
    this.authority = this.loadAuthority();

    // Initialize LiveForge client
    this.client = new LiveForgeClient(
      this.connection,
      { payer: this.authority } as any,
      PROGRAM_ID
    );
  }

  private loadAuthority(): Keypair {
    // Try to load from AgentWallet config first
    const agentWalletPath = path.join(process.env.HOME!, '.agentwallet', 'solana-keypair.json');
    if (fs.existsSync(agentWalletPath)) {
      const secretKey = JSON.parse(fs.readFileSync(agentWalletPath, 'utf-8'));
      return Keypair.fromSecretKey(new Uint8Array(secretKey));
    }

    // Fallback to default Solana CLI wallet
    const solanaConfigPath = path.join(process.env.HOME!, '.config', 'solana', 'id.json');
    if (fs.existsSync(solanaConfigPath)) {
      const secretKey = JSON.parse(fs.readFileSync(solanaConfigPath, 'utf-8'));
      return Keypair.fromSecretKey(new Uint8Array(secretKey));
    }

    throw new Error('No wallet found. Please set up AgentWallet or Solana CLI wallet.');
  }

  /**
   * Initialize a build on-chain
   */
  async initializeBuild(buildId: string, projectName: string): Promise<string> {
    try {
      const txHash = await this.client.initializeBuild(buildId, projectName, this.authority);
      console.log(`✅ Build initialized on-chain: ${txHash}`);
      return txHash;
    } catch (error: any) {
      console.error('Failed to initialize build:', error.message);
      throw error;
    }
  }

  /**
   * Log an action on-chain
   */
  async logAction(
    buildId: string,
    actionType: 'Analyze' | 'GenerateCode' | 'CompileProgram' | 'RunTests' | 'Deploy' | 'GenerateSDK' | 'GenerateFrontend' | 'Document',
    description: string,
    content: string
  ): Promise<string> {
    try {
      const actionTypeEnum = ActionType[actionType as keyof typeof ActionType];
      const txHash = await this.client.logAction(
        buildId,
        actionTypeEnum,
        description,
        content,
        this.authority
      );
      console.log(`✅ Action logged: ${actionType} (${txHash})`);
      return txHash;
    } catch (error: any) {
      console.error(`Failed to log ${actionType}:`, error.message);
      throw error;
    }
  }

  /**
   * Complete a build
   */
  async completeBuild(buildId: string, success: boolean, programId?: string): Promise<string> {
    try {
      const txHash = await this.client.completeBuild(buildId, success, programId, this.authority);
      console.log(`✅ Build completed: ${success ? 'SUCCESS' : 'FAILED'} (${txHash})`);
      return txHash;
    } catch (error: any) {
      console.error('Failed to complete build:', error.message);
      throw error;
    }
  }

  /**
   * Get build info
   */
  async getBuild(buildId: string) {
    return await this.client.getBuild(buildId);
  }

  /**
   * Get all builds
   */
  async listBuilds() {
    return await this.client.listBuilds(this.authority.publicKey);
  }

  /**
   * Get stats
   */
  async getStats() {
    return await this.client.getStats();
  }

  /**
   * Check wallet balance
   */
  async getBalance(): Promise<number> {
    const balance = await this.connection.getBalance(this.authority.publicKey);
    return balance / 1e9; // Convert lamports to SOL
  }

  /**
   * Get wallet address
   */
  getAddress(): string {
    return this.authority.publicKey.toBase58();
  }
}

// Export singleton instance
export const solanaLogger = new SolanaLogger();
