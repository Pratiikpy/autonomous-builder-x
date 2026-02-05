'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

type BuildRecord = {
  id: string;
  prompt: string;
  status: 'success' | 'failed' | 'in_progress';
  startedAt: string;
  completedAt: string | null;
  duration: string | null;
  programId: string | null;
  chainProofs: Array<{ step: number; txHash: string; hash: string }>;
  files: Array<{ name: string; content: string }>;
};

const PROGRAM_ADDRESS = 'GUyhK2AvkPcVwt4Q1ABmMsQTGvZphiAMaAnDWLSyZoSK';

export default function BuildHistoryPage() {
  const [builds, setBuilds] = useState<BuildRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBuilds();
  }, []);

  const fetchBuilds = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/builds');
      
      if (!response.ok) {
        throw new Error('Failed to fetch builds');
      }

      const data = await response.json();
      setBuilds(data.builds || []);
    } catch (err: any) {
      console.error('Error fetching builds:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalBuilds = builds.length;
  const successfulBuilds = builds.filter(b => b.status === 'success').length;
  const successRate = totalBuilds > 0 ? ((successfulBuilds / totalBuilds) * 100).toFixed(1) : '0.0';
  
  const completedBuilds = builds.filter(b => b.status === 'success' && b.duration);
  const avgBuildTime = completedBuilds.length > 0
    ? Math.round(
        completedBuilds.reduce((sum, b) => {
          const [min, sec] = (b.duration || '0m 0s').split(' ');
          return sum + parseInt(min) * 60 + parseInt(sec);
        }, 0) / completedBuilds.length
      )
    : 0;

  const formatDuration = (duration: string | null) => {
    if (!duration) return 'N/A';
    return duration;
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
    if (hours > 0) return `${hours}h ago`;
    return `${mins}m ago`;
  };

  const formatAvgTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚡</div>
          <div className="text-green-500">Loading build history...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <div className="text-red-400 mb-2">Error loading builds</div>
          <div className="text-green-700 text-sm mb-4">{error}</div>
          <button
            onClick={fetchBuilds}
            className="bg-green-600 hover:bg-green-500 text-black font-bold py-2 px-6 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
            <div className="text-green-700 text-xs mt-2">programs generated</div>
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
            <div className="text-4xl font-bold text-green-400">{formatAvgTime(avgBuildTime)}</div>
            <div className="text-green-700 text-xs mt-2">average duration</div>
          </div>

          {/* On-Chain Verifications */}
          <div className="bg-green-950/20 border border-green-500/30 rounded-lg p-6 backdrop-blur">
            <div className="text-green-600 text-xs mb-2">CHAIN_PROOFS</div>
            <div className="text-4xl font-bold text-green-400">
              {builds.reduce((sum, b) => sum + (b.chainProofs?.length || 0), 0)}
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
        {builds.length === 0 ? (
          <div className="bg-green-950/20 border border-green-500/30 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl text-green-400 mb-2">No builds yet</h3>
            <p className="text-green-600 mb-6">Start building your first Solana agent!</p>
            <Link
              href="/live"
              className="inline-block bg-green-600 hover:bg-green-500 text-black font-bold py-3 px-8 rounded transition-colors"
            >
              {'>'} START_BUILD()
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-green-400 text-lg">
                {'>'} BUILD_HISTORY ({builds.length} entries)
              </h2>
              <button
                onClick={fetchBuilds}
                className="text-green-600 hover:text-green-400 text-sm transition-colors"
              >
                🔄 Refresh
              </button>
            </div>

            {builds.map((build) => (
              <div
                key={build.id}
                className={`bg-green-950/20 border rounded-lg p-6 backdrop-blur transition-all hover:border-green-400/50 ${
                  build.status === 'success' 
                    ? 'border-green-500/30' 
                    : build.status === 'failed'
                    ? 'border-red-500/30'
                    : 'border-yellow-500/30'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-green-400">
                        {build.prompt}
                      </h3>
                      {build.status === 'success' ? (
                        <span className="bg-green-600/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/50 flex items-center gap-1">
                          <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
                          SUCCESS
                        </span>
                      ) : build.status === 'failed' ? (
                        <span className="bg-red-600/20 text-red-400 text-xs px-3 py-1 rounded-full border border-red-500/50">
                          FAILED
                        </span>
                      ) : (
                        <span className="bg-yellow-600/20 text-yellow-400 text-xs px-3 py-1 rounded-full border border-yellow-500/50">
                          IN PROGRESS
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-green-500">{formatTimeAgo(build.startedAt)}</div>
                    <div className="text-green-700">
                      {new Date(build.startedAt).toLocaleString('en-US', {
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
                    <code className="text-green-500 text-sm bg-black/40 px-2 py-1 rounded block truncate">
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
                      {build.chainProofs?.length || 0} verifications
                    </div>
                  </div>
                </div>

                {/* Program ID (if successful) */}
                {build.status === 'success' && build.programId && (
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
                        View ↗
                      </a>
                    </div>
                  </div>
                )}

                {/* On-Chain Verification Hashes */}
                {build.chainProofs && build.chainProofs.length > 0 && (
                  <div>
                    <div className="text-green-700 text-xs mb-2">ON_CHAIN_VERIFICATION:</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                      {build.chainProofs.map((proof, i) => (
                        <a
                          key={i}
                          href={`https://explorer.solana.com/tx/${proof.txHash}?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-black/40 hover:bg-black/60 px-3 py-2 rounded text-xs text-green-500 hover:text-green-400 transition-colors flex items-center justify-between gap-2 group"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-green-700">Step {proof.step}</div>
                            <code className="text-green-500 truncate block">{proof.txHash}</code>
                          </div>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">↗</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

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
