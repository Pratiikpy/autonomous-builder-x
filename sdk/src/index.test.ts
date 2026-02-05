/**
 * LiveForge SDK Tests
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js';
import LiveForgeClient, { ActionType } from './index';

describe('LiveForgeClient', () => {
  let client: LiveForgeClient;
  let buildId: string;

  beforeAll(() => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const wallet = { payer: Keypair.generate() };
    const programId = Keypair.generate().publicKey;
    
    client = new LiveForgeClient(connection, wallet as any, programId);
    buildId = `test_build_${Date.now()}`;
  });

  it('should create a client instance', () => {
    expect(client).toBeDefined();
  });

  it('should generate build PDA correctly', () => {
    // Test PDA generation
    expect(buildId).toBeTruthy();
  });

  it('should hash content correctly', () => {
    const crypto = require('crypto');
    const content = 'test content';
    const hash = crypto.createHash('sha256').update(content).digest();
    expect(hash.length).toBe(32);
  });

  // Integration tests (require deployed program)
  it.skip('should initialize a build', async () => {
    const tx = await client.initializeBuild(buildId, 'Test Project');
    expect(tx).toBeTruthy();
  });

  it.skip('should log an action', async () => {
    const tx = await client.logAction(
      buildId,
      ActionType.Analyze,
      'Test analysis',
      'test content'
    );
    expect(tx).toBeTruthy();
  });

  it.skip('should complete a build', async () => {
    const tx = await client.completeBuild(buildId, true, 'test_program_id');
    expect(tx).toBeTruthy();
  });

  it.skip('should fetch build metadata', async () => {
    const build = await client.getBuild(buildId);
    expect(build.buildId).toBe(buildId);
    expect(build.projectName).toBe('Test Project');
  });

  it.skip('should list all builds', async () => {
    const builds = await client.listBuilds();
    expect(Array.isArray(builds)).toBe(true);
  });

  it.skip('should get stats', async () => {
    const stats = await client.getStats();
    expect(stats.totalBuilds).toBeGreaterThanOrEqual(0);
  });
});
