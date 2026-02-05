'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Stats {
  totalBuilds: number;
  successRate: string;
  avgBuildTime: string;
  totalProofs: number;
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to fetch stats:', err));
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Header with Navigation */}
      <div className="border-b border-green-500/30 bg-black/50 backdrop-blur px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-400">
            ⚡ LiveForge <span className="text-green-600 text-sm ml-2">// Autonomous Builder</span>
          </h1>
          <nav className="flex gap-4 text-sm">
            <Link 
              href="/"
              className="text-green-400 border-b border-green-400"
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
              className="text-green-600 hover:text-green-400 transition-colors"
            >
              Build History
            </Link>
            <Link 
              href="/autonomous"
              className="text-green-600 hover:text-green-400 transition-colors"
            >
              Autonomous
            </Link>
            <Link 
              href="/wallet"
              className="text-green-600 hover:text-green-400 transition-colors"
            >
              Agent Wallet
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">⚡</div>
          <h1 className="text-5xl font-bold mb-4 text-green-400">
            LiveForge
          </h1>
          <p className="text-2xl text-green-600 mb-2">
            Watch AI Build Solana Agents, Live
          </p>
          <p className="text-lg text-green-700 max-w-2xl mx-auto">
            The first meta-agent that builds other agents in real-time with complete transparency. 
            Every action visible. Every step verified on-chain.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center mb-16">
          <Link
            href="/live"
            className="bg-green-600 hover:bg-green-500 text-black font-bold py-4 px-8 rounded transition-colors text-lg"
          >
            {'>'} Start Building
          </Link>
          <Link
            href="/history"
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-8 rounded transition-colors text-lg"
          >
            View Build History
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Feature 1 */}
          <div className="bg-green-950/20 border border-green-500/30 rounded-lg p-6 backdrop-blur">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-xl font-bold text-green-400 mb-2">Real-Time Transparency</h3>
            <p className="text-green-600">
              Watch AI reasoning, code generation, compilation, and deployment live. No black boxes.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-green-950/20 border border-green-500/30 rounded-lg p-6 backdrop-blur">
            <div className="text-3xl mb-3">🔗</div>
            <h3 className="text-xl font-bold text-green-400 mb-2">On-Chain Verification</h3>
            <p className="text-green-600">
              Every build step logged to Solana with SHA256 proofs. Blockchain-verified autonomy.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-green-950/20 border border-green-500/30 rounded-lg p-6 backdrop-blur">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-xl font-bold text-green-400 mb-2">Complete Automation</h3>
            <p className="text-green-600">
              From natural language prompt to deployed Solana program in 3-5 minutes. Fully autonomous.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-green-950/20 border border-green-500/30 rounded-lg p-6 backdrop-blur">
            <div className="text-3xl mb-3">🏗️</div>
            <h3 className="text-xl font-bold text-green-400 mb-2">Production-Ready Output</h3>
            <p className="text-green-600">
              Get Anchor programs, TypeScript SDKs, Next.js frontends, and complete documentation.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-purple-900/30 to-green-900/30 border border-green-500/30 rounded-lg p-8 backdrop-blur mb-16">
          <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">
            {'>'} HOW_IT_WORKS
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-green-600 text-black font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <div className="text-green-400 font-bold">Describe Your Agent</div>
                <div className="text-green-600 text-sm">Natural language prompt: "Build a Solana NFT minting program"</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-600 text-black font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <div className="text-green-400 font-bold">Watch AI Build</div>
                <div className="text-green-600 text-sm">See reasoning, code generation, compilation, and deployment in real-time</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-600 text-black font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <div className="text-green-400 font-bold">Verify On-Chain</div>
                <div className="text-green-600 text-sm">Every step logged to Solana with SHA256 verification</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-600 text-black font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div>
                <div className="text-green-400 font-bold">Get Working Code</div>
                <div className="text-green-600 text-sm">Deployed program ID, SDK, frontend, and documentation</div>
              </div>
            </div>
          </div>
        </div>

        {/* On-Chain Verification Badge */}
        <div className="bg-gradient-to-r from-purple-900/30 to-green-900/30 border border-purple-500/30 rounded-lg p-6 backdrop-blur text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">✓</span>
            <h3 className="text-2xl font-bold text-green-400">Verified on Solana</h3>
          </div>
          <p className="text-green-600 mb-4">
            All builds logged to on-chain program with SHA256 verification
          </p>
          <a
            href="https://explorer.solana.com/address/GUyhK2AvkPcVwt4Q1ABmMsQTGvZphiAMaAnDWLSyZoSK?cluster=devnet"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded transition-colors"
          >
            View Program on Explorer ↗
          </a>
          <div className="mt-4 pt-4 border-t border-green-500/20">
            <div className="text-green-700 text-xs mb-1">PROGRAM_ID:</div>
            <code className="text-green-500 text-xs bg-black/40 px-3 py-1 rounded">
              GUyhK2AvkPcVwt4Q1ABmMsQTGvZphiAMaAnDWLSyZoSK
            </code>
          </div>
        </div>

        {/* Stats Preview */}
        <div className="grid grid-cols-3 gap-4 mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">
              {stats ? `${stats.totalBuilds}+` : '...'}
            </div>
            <div className="text-green-600 text-sm">Programs Built</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">
              {stats ? `${stats.successRate}%` : '...'}
            </div>
            <div className="text-green-600 text-sm">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">
              {stats ? `~${stats.avgBuildTime.split(' ')[0]}` : '...'}
            </div>
            <div className="text-green-600 text-sm">Avg Build Time</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur border-t border-green-500/30 px-6 py-3 text-center text-xs text-green-600">
        <span>LiveForge v1.0 // Solana Agent Hackathon 2026 // Autonomous Builder - Proven on Chain</span>
      </div>
    </div>
  );
}
