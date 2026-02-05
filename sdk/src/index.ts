/**
 * LiveForge SDK - TypeScript client for on-chain build logging
 */

import * as anchor from '@coral-xyz/anchor';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { Connection, PublicKey, Keypair, Transaction, SystemProgram } from '@solana/web3.js';
import * as crypto from 'crypto';

export interface BuildMetadata {
  buildId: string;
  projectName: string;
  authority: PublicKey;
  stepCount: number;
  startedAt: number;
  completedAt: number;
  status: 'InProgress' | 'Completed' | 'Failed';
  deployedProgramId?: string;
}

export interface BuildActionMetadata {
  build: PublicKey;
  stepNumber: number;
  actionType: ActionType;
  description: string;
  contentHash: Buffer;
  timestamp: number;
}

export enum ActionType {
  Analyze = 0,
  GenerateCode = 1,
  CompileProgram = 2,
  RunTests = 3,
  Deploy = 4,
  GenerateSDK = 5,
  GenerateFrontend = 6,
  Document = 7,
}

export class LiveForgeClient {
  private program: Program;
  private connection: Connection;
  private provider: AnchorProvider;
  
  constructor(
    connection: Connection,
    wallet: anchor.Wallet,
    programId: PublicKey
  ) {
    this.connection = connection;
    this.provider = new AnchorProvider(connection, wallet, {});
    
    // Load program IDL (will be generated after build)
    // For now, using the program ID directly
    this.program = new Program(
      IDL as any, // Will use generated IDL
      programId,
      this.provider
    );
  }

  /**
   * Initialize a new build session on-chain
   */
  async initializeBuild(
    buildId: string,
    projectName: string,
    authority?: Keypair
  ): Promise<string> {
    const signer = authority || (this.provider.wallet as anchor.Wallet).payer;
    
    const [buildPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('build'), Buffer.from(buildId)],
      this.program.programId
    );

    const tx = await this.program.methods
      .initializeBuild(buildId, projectName)
      .accounts({
        build: buildPDA,
        authority: signer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([signer])
      .rpc();

    return tx;
  }

  /**
   * Log a build action with SHA256 verification
   */
  async logAction(
    buildId: string,
    actionType: ActionType,
    description: string,
    content: string,
    authority?: Keypair
  ): Promise<string> {
    const signer = authority || (this.provider.wallet as anchor.Wallet).payer;
    
    const [buildPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('build'), Buffer.from(buildId)],
      this.program.programId
    );

    // Compute SHA256 hash
    const contentHash = crypto.createHash('sha256').update(content).digest();

    // Generate new action account
    const actionAccount = Keypair.generate();

    const tx = await this.program.methods
      .logAction(
        { [Object.keys(ActionType)[actionType]]: {} } as any,
        description,
        Array.from(contentHash)
      )
      .accounts({
        build: buildPDA,
        action: actionAccount.publicKey,
        authority: signer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([signer, actionAccount])
      .rpc();

    return tx;
  }

  /**
   * Mark build as complete
   */
  async completeBuild(
    buildId: string,
    success: boolean,
    programId?: string,
    authority?: Keypair
  ): Promise<string> {
    const signer = authority || (this.provider.wallet as anchor.Wallet).payer;
    
    const [buildPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('build'), Buffer.from(buildId)],
      this.program.programId
    );

    const tx = await this.program.methods
      .completeBuild(success, programId || null)
      .accounts({
        build: buildPDA,
        authority: signer.publicKey,
      })
      .signers([signer])
      .rpc();

    return tx;
  }

  /**
   * Get build metadata
   */
  async getBuild(buildId: string): Promise<BuildMetadata> {
    const [buildPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('build'), Buffer.from(buildId)],
      this.program.programId
    );

    const buildAccount = await this.program.account.build.fetch(buildPDA);
    
    return {
      buildId: buildAccount.buildId,
      projectName: buildAccount.projectName,
      authority: buildAccount.authority,
      stepCount: buildAccount.stepCount,
      startedAt: buildAccount.startedAt.toNumber(),
      completedAt: buildAccount.completedAt.toNumber(),
      status: Object.keys(buildAccount.status)[0] as any,
      deployedProgramId: buildAccount.deployedProgramId || undefined,
    };
  }

  /**
   * List all builds by authority
   */
  async listBuilds(authority?: PublicKey): Promise<BuildMetadata[]> {
    const filters = authority ? [
      {
        memcmp: {
          offset: 8, // After discriminator
          bytes: authority.toBase58(),
        }
      }
    ] : [];

    const builds = await this.program.account.build.all(filters);
    
    return builds.map(b => ({
      buildId: b.account.buildId,
      projectName: b.account.projectName,
      authority: b.account.authority,
      stepCount: b.account.stepCount,
      startedAt: b.account.startedAt.toNumber(),
      completedAt: b.account.completedAt.toNumber(),
      status: Object.keys(b.account.status)[0] as any,
      deployedProgramId: b.account.deployedProgramId || undefined,
    }));
  }

  /**
   * Get network stats
   */
  async getStats(): Promise<{
    totalBuilds: number;
    successfulBuilds: number;
    failedBuilds: number;
  }> {
    const allBuilds = await this.listBuilds();
    
    return {
      totalBuilds: allBuilds.length,
      successfulBuilds: allBuilds.filter(b => b.status === 'Completed').length,
      failedBuilds: allBuilds.filter(b => b.status === 'Failed').length,
    };
  }
}

// Placeholder IDL - will be replaced with generated IDL after build
const IDL = {
  version: "0.1.0",
  name: "liveforge_logger",
  instructions: [],
  accounts: [],
  types: [],
};

export default LiveForgeClient;
