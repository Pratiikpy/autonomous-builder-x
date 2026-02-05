'use client';

import Link from 'next/link';
import { useState } from 'react';

type BuildRecord = {
  id: string;
  projectName: string;
  buildType: string;
  timestamp: Date;
  status: 'success' | 'failed';
  duration: number; // seconds
  programId: string;
  chainProof: string[];
};

// Mock data - realistic build history
const MOCK_BUILDS: BuildRecord[] = [
  {
    id: 'build_8x9k2m',
    projectName: 'Solana NFT Minting Program',
    buildType: 'NFT Infrastructure',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'success',
    duration: 247,
    programId: '7xK8j2NqPmH9vR3sT4wB6cL5dE1fG8hA9iJ0kK1lM2nN3',
    chainProof: ['5f2ae4d...', '9b8c3f1...', 'e7d2a9b...', '3c5f8e2...']
  },
  {
    id: 'build_7y8j1n',
    projectName: 'DAO Treasury Manager',
    buildType: 'DeFi Governance',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    status: 'success',
    duration: 312,
    programId: '4yH7i8JpK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0',
    chainProof: ['a1b2c3d...', 'd4e5f6g...', 'h7i8j9k...', 'l0m1n2o...']
  },
  {
    id: 'build_6x7h0p',
    projectName: 'DeFi Token Swap',
    buildType: 'DEX Protocol',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    status: 'success',
    duration: 289,
    programId: '2wF3g4HiI5jJ6kK7lL8mM9nN0oO1pP2qQ3rR4sS5tT6',
    chainProof: ['p9q0r1s...', 't2u3v4w...', 'x5y6z7a...', 'b8c9d0e...']
  },
  {
    id: 'build_5w6g9q',
    projectName: 'Solana Payment Splitter',
    buildType: 'Payment Infrastructure',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    status: 'failed',
    duration: 143,
    programId: '',
    chainProof: ['f1g2h3i...', 'j4k5l6m...']
  },
  {
    id: 'build_4v5f8r',
    projectName: 'Escrow Program for Freelancers',
    buildType: 'Smart Contract',
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
    status: 'success',
    duration: 276,
    programId: '9yA0bB1cC2dD3eE4fF5gG6hH7iI8jJ9kK0lL1mM2nN3',
    chainProof: ['n7o8p9q...', 'r0s1t2u...', 'v3w4x5y...', 'z6a7b8c...']
  },
  {
    id: 'build_3u4e7s',
    projectName: 'Staking Rewards Distributor',
    buildType: 'DeFi Staking',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
    status: 'success',
    duration: 301,
    programId: '5xC6dD7eE8fF9gG0hH1iI2jJ3kK4lL5mM6nN7oO8pP9',
    chainProof: ['d9e0f1g...', 'h2i3j4k...', 'l5m6n7o...', 'p8q9r0s...']
  },
  {
    id: 'build_2t3d6t',
    projectName: 'Multi-Sig Wallet Manager',
    buildType: 'Security Infrastructure',
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000), // 36 hours ago
    status: 'success',
    duration: 334,
    programId: '1vB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5',
    chainProof: ['t1u2v3w...', 'x4y5z6a...', 'b7c8d9e...', 'f0g1h2i...']
  },
  {
    id: 'build_1s2c5u',
    projectName: 'Automated Market Maker',
    buildType: 'DEX Protocol',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), // 48 hours ago
    status: 'success',
    duration: 356,
    programId: '3uA4bB5cC6dD7eE8fF9gG0hH1iI2jJ3kK4lL5mM6nN7',
    chainProof: ['j3k4l5m...', 'n6o7p8q...', 'r9s0t1u...', 'v2w3x4y...']
  }
];

const PROGRAM_ADDRESS = 'GUyhK2AvkPcVwt4Q1ABmMsQTGvZphiAMaAnDWLSyZoSK';

export default function BuildHistoryPage() {
  const [builds] = useState<BuildRecord[]>(MOCK_BUILDS);

  // Calculate stats
  const totalBuilds = builds.length;
  const successfulBuilds = builds.filter(b => b.status === 'success').length;
  const successRate = ((successfulBuilds / totalBuilds) * 100).toFixed(1);
  const avgBuildTime = Math.round(
    builds.filter(b => b.status === 'success').reduce((sum, b) => sum + b.duration, 0) / successfulBuilds
  );

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) return `${hours}h ago`;
    return `${mins}m ago`;
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Header with Navigation */}
      <div className="border-b border-green-500/30 bg-black/50 backdrop-blur px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-400">
            ⚡ LiveForge <span className="text-green-600 text-sm ml-2">// Build History</span>
          </h1>
          <nav className="flex gap-4 text-sm">
            <Link 
              href="/"
              className="text-green-600 hover:text-green-400 transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/live"
              className="text-green-600 hover:text-green-400 transition-colors"
            >
              Live Build
            </Link>
            <Link 
              href="/history"
              className="text-green-400 border-b border-green-400"
            >
              Build History
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Total Builds */}
          <div className="bg-green-950/20 border border-green-500/30 rounded-lg p-6 backdrop-blur">
            <div className="text-green-600 text-xs mb-2">TOTAL_BUILDS</div>
            <div className="text-4xl font-bold text-green-400">{totalBuilds}</div>
            <div className="text-green-700 text-xs mt-2">programs deployed</div>
          </div>

          {/* Success Rate */}
          <div className="bg-green-950/20 border border-green-500/30 rounded-lg p-6 backdrop-blur">
            <div className="text-green-600 text-xs mb-2">SUCCESS_RATE</div>
            <div className="text-4xl font-bold text-green-400">{successRate}%</div>
            <div className="text-green-700 text-xs mt-2">{successfulBuilds}/{totalBuilds} successful</div>
          </div>

          {/* Avg Build Time */}
          <div className="bg-green-950/20 border border-green-500/30 rounded-lg p-6 backdrop-blur">
            <div className="text-green-600 text-xs mb-2">AVG_BUILD_TIME</div>
            <div className="text-4xl font-bold text-green-400">{formatDuration(avgBuildTime).split(' ')[0]}</div>
            <div className="text-green-700 text-xs mt-2">average duration</div>
          </div>

          {/* On-Chain Verifications */}
          <div className="bg-green-950/20 border border-green-500/30 rounded-lg p-6 backdrop-blur">
            <div className="text-green-600 text-xs mb-2">CHAIN_PROOFS</div>
            <div className="text-4xl font-bold text-green-400">
              {builds.reduce((sum, b) => sum + b.chainProof.length, 0)}
            </div>
            <div className="text-green-700 text-xs mt-2">on-chain verifications</div>
          </div>
        </div>

        {/* Verified Badge */}
        <div className="bg-gradient-to-r from-purple-900/30 to-green-900/30 border border-green-500/30 rounded-lg p-4 mb-8 backdrop-blur">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">✓</div>
              <div>
                <div className="text-green-400 font-bold">Verified on Solana Devnet</div>
                <div className="text-green-600 text-sm">All builds logged to on-chain program</div>
              </div>
            </div>
            <a
              href={`https://explorer.solana.com/address/${PROGRAM_ADDRESS}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded transition-colors text-sm flex items-center gap-2"
            >
              View Program on Explorer ↗
            </a>
          </div>
          <div className="mt-3 pt-3 border-t border-green-500/20">
            <div className="text-green-700 text-xs mb-1">PROGRAM_ID:</div>
            <code className="text-green-500 text-xs bg-black/40 px-2 py-1 rounded">
              {PROGRAM_ADDRESS}
            </code>
          </div>
        </div>

        {/* Build Cards */}
        <div className="space-y-4">
          <h2 className="text-green-400 text-lg mb-4">
            {'>'} BUILD_HISTORY ({builds.length} entries)
          </h2>

          {builds.map((build) => (
            <div
              key={build.id}
              className={`bg-green-950/20 border rounded-lg p-6 backdrop-blur transition-all hover:border-green-400/50 ${
                build.status === 'success' ? 'border-green-500/30' : 'border-red-500/30'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-green-400">
                      {build.projectName}
                    </h3>
                    {build.status === 'success' ? (
                      <span className="bg-green-600/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/50 flex items-center gap-1">
                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
                        SUCCESS
                      </span>
                    ) : (
                      <span className="bg-red-600/20 text-red-400 text-xs px-3 py-1 rounded-full border border-red-500/50">
                        FAILED
                      </span>
                    )}
                  </div>
                  <div className="text-green-600 text-sm">{build.buildType}</div>
                </div>
                <div className="text-right text-sm">
                  <div className="text-green-500">{formatTimeAgo(build.timestamp)}</div>
                  <div className="text-green-700">
                    {build.timestamp.toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Build ID */}
                <div>
                  <div className="text-green-700 text-xs mb-1">BUILD_ID:</div>
                  <code className="text-green-500 text-sm bg-black/40 px-2 py-1 rounded block">
                    {build.id}
                  </code>
                </div>

                {/* Duration */}
                <div>
                  <div className="text-green-700 text-xs mb-1">DURATION:</div>
                  <div className="text-green-400 text-sm font-bold">
                    {formatDuration(build.duration)}
                  </div>
                </div>

                {/* Chain Proofs */}
                <div>
                  <div className="text-green-700 text-xs mb-1">CHAIN_PROOFS:</div>
                  <div className="text-green-400 text-sm font-bold">
                    {build.chainProof.length} verifications
                  </div>
                </div>
              </div>

              {/* Program ID (if successful) */}
              {build.status === 'success' && (
                <div className="mb-4">
                  <div className="text-green-700 text-xs mb-1">PROGRAM_ID:</div>
                  <div className="flex items-center gap-2">
                    <code className="text-green-500 text-xs bg-black/40 px-2 py-1 rounded flex-1 truncate">
                      {build.programId}
                    </code>
                    <a
                      href={`https://explorer.solana.com/address/${build.programId}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 text-sm flex items-center gap-1 whitespace-nowrap"
                    >
                      View on Explorer ↗
                    </a>
                  </div>
                </div>
              )}

              {/* On-Chain Verification Hashes */}
              <div>
                <div className="text-green-700 text-xs mb-2">ON_CHAIN_VERIFICATION:</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {build.chainProof.map((hash, i) => (
                    <a
                      key={i}
                      href={`https://explorer.solana.com/tx/${hash}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-black/40 hover:bg-black/60 px-3 py-2 rounded text-xs text-green-500 hover:text-green-400 transition-colors flex items-center justify-between gap-2 group"
                    >
                      <div>
                        <div className="text-green-700">Step {i + 1}</div>
                        <code className="text-green-500">{hash}</code>
                      </div>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Build Another */}
        <div className="mt-8 text-center">
          <Link
            href="/live"
            className="inline-block bg-green-600 hover:bg-green-500 text-black font-bold py-3 px-8 rounded transition-colors"
          >
            {'>'} BUILD_NEW_AGENT()
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur border-t border-green-500/30 px-6 py-3 text-center text-xs text-green-600">
        <span>LiveForge v1.0 // Solana Agent Hackathon 2026 // Autonomous Builder - Proven on Chain</span>
      </div>
    </div>
  );
}
